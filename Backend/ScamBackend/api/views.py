from django.shortcuts import render
from rest_framework import generics
from .models import *
from .serializers import *
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,IsAuthenticatedOrReadOnly
from rest_framework.exceptions import PermissionDenied
from rest_framework.validators import ValidationError
from django.db.models import Count,Q,Sum
from .Permissions import OwnerOrAdmin,IsAdmin,PrivateOwnerOrAdmin,IsSuperUserOrReadOnly
from rest_framework import pagination
from .consumers import Broadcast, home_room, chat_room, group_room
from django.db.models import F # ya is leya ka agr do user ik stah like ya ik like or ik repost par click kary to count galat na

"""ya part dashboard ka hai"""
"""ya part dashboard ka hai"""
class DashBoard(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_staff:
            queryset = Profile.objects.all()
        else:
            queryset = Profile.objects.filter(user=user)
        return queryset
    
    def get(self, request, *args, **kwargs):
        user = request.user
        is_super = user.is_superuser or user.is_staff

        # Profile statistics
        total_users = Profile.objects.count()
        total_blacklisted = Profile.objects.filter(isBanned=False).count()
        total_flagged = Profile.objects.filter(risk="High").count()

        # Post statistics 
        if is_super:
            posts_qs = Post.objects.all()
        else:
            posts_qs = Post.objects.filter(user=user)
        
        total_post = posts_qs.count()
        
        # Database khud sum nikal kar dega ('for' loop ki zaroorat nahi)
        total_view = posts_qs.aggregate(Sum('views'))['views__sum']or 0
        total_repost = posts_qs.aggregate(Sum('repost'))['repost__sum'] or 0
        total_comment = posts_qs.aggregate(Sum('comment'))['comment__sum'] or 0
        total_like = posts_qs.aggregate(Sum('like'))['like__sum']or 0

        # Is ma sirf first 5 nikaly hai 
        recent_flagged = list(
            Profile.objects.filter(risk='High')
            .order_by('-id')
            .values_list('user__username', flat=True)[:5]
        )
        
        blacklist_summary = list(
            Profile.objects.filter(isBanned=False)
            .order_by('-id')
            .values_list('user__username', flat=True)[:5]
        )
        
        high_risk_activity = ["Phishing", "Order Scam", "Spam Complaints"]

        data = {
            # Profile & Risk data
            "recent_flagged": recent_flagged,
            "blacklist_summary": blacklist_summary,
            "high_risk_activity": high_risk_activity,
            "risk": total_flagged,
            "total_user": total_users,
            "blacklist_user": total_blacklisted,

            "total_posts": total_post,
            "total_views": total_view,
            "total_comments": total_comment,
            "total_likes": total_like,
            "total_reposts": total_repost,
            
            "post_views": total_view,
            "post_post": total_post,
            "post_repost": total_repost,
        }

        return Response(data)

# ya pagination ka leay hai 
class feedpagnation (pagination.PageNumberPagination):
    page_size = 4


"""ya function 2 api ke data ko combine karna ka leya hai"""
class HomeFeedData (generics.ListAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = SerializerPost
    pagination_class = feedpagnation

    def get_queryset(self):
        return Post.objects.none()

    def list(self, request, *args, **kwargs):
        # data store karny ka leya 
        feed_data = []

        # ya part user or ki all post ki list nikalny kaleya hai ka is user na keya post keya hai
        if request.user.is_authenticated:
           hidden_post = HiddenPost.objects.filter(
               user=request.user
           ).values_list('post_id',flat=True)
         
        else:
            hidden_post = []

        # is par ma excludes add kar ka hum un hidden post ko front end par user ki hide post ko us ko show nahi karway gy
        posts = (Post.objects.select_related("user","profile")
                 .filter(profile__isBanned=True)
                 .exclude(id__in=hidden_post))
        
        # ab sab sa phaly repost ka sary data ko serialize karna 
        # ab repost ma bhi asa hi kary gy jasa hum na post ma keya thai exclude ko add karn
        repost = (Repost.objects.select_related('user','profile','post','post__user','post__profile')
                  .filter(profile__isBanned=True,post__profile__isBanned=True)
                  .exclude(post__in=hidden_post))

        # yaha par phaly hum light data ko get kar laty hai 
        row = []
        for post in posts:
            row.append((post.createdat,'post',post))
        for reposts in repost:
            row.append((reposts.timestamp,"repost" ,reposts))

        row.sort(
            key=lambda item: item[0].timestamp() if item[0] else 0 
            ,reverse=True
            )

        page = self.paginate_queryset(row)

        serializer_context = {'request': request}
        # sab sa phaly post ka sary data ko serialize karna 
        for time ,item_type , item in page:
            if item_type == "post":                
                serialized = SerializerPost(item ,context=serializer_context).data
                feed_data.append({
                    'is_repost':False,
                    'timestamp':time,
                    'post':serialized,
                    'repost_user':None,
                })
            else:
                # serialized = SerializerRepost(reposts , context={'request':request}).data
                # is ma kuch changing karny ku ka serializer ma primkey add key hai 
                repost_data = SerializerRepost(item , context=serializer_context).data
                # ab hum post ka sara data jis ma id ,image,usernaem ,text subkuc hai use ki json ma convert kary gy or repost ma send kary ga
                post_data = SerializerPost(item.post , context=serializer_context).data
                
                feed_data.append({
                    'timestamp':time,
                    'post':post_data,
                    'repost_user':({
                        'username': repost_data.get('Username'),
                        'Userpic': repost_data.get('Userpic'),
                    }),
                })

        if page is not None:
            return self.get_paginated_response(feed_data)
        return Response(feed_data)
        

"""post section"""
# ya part Post create karny ka hai
class LCPost (generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = SerializerPost

    def get_queryset(self):
        return Post.objects.filter(profile__isBanned=False)

    def create(self, request, *args, **kwargs):
        user = self.request.user

        # phaly check ka user na subscription buy kar rakhi hia ya phir nahi
        already_bue_sub =Subscription.objects.filter(
            user = user,
            is_active = True,
            expire_package__gt = timezone.now()
        ).exists()

        # agar nahi hia to 
        if not already_bue_sub:
            # phaly hum post ki end wali yani jo last time update ki thei us ko nikal ty hia
            limit = Post_limit.objects.order_by('-id').first()

            # agar admin na limit set nahi ki hai to hum likh to ya auto fill kar day limit
            if limit:
                today_limit = limit.limit_per_day
            else:
                today_limit = 20

            # ab post count karny hai 
            today_post_limit = Post.objects.filter(
                user = user,
                createdat__date = timezone.now().date()
            ).count()
            if today_post_limit >= today_limit:
                raise ValidationError({
                    "error":"ap apni limit use kar chucky hia "
                    })
                 
        return super().create(request, *args, **kwargs)


    def perform_create(self, serializer):
         user = self.request.user
         post = serializer.save(user=user, profile=user.profile)
         # ya consumer ka hai   
         serialized_data = SerializerPost(post, context={'request': self.request}).data
         Broadcast(home_room(), 'send_live_data', {
             'kind': 'post_created',
             'payload': serialized_data
         })
    

# ya  part post delete update retrieve ka hai 
class DURPost (generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [OwnerOrAdmin]
    queryset = Post.objects.all()
    serializer_class = SerializerPost
    lookup_field = 'pk'

    def perform_update(self, serializer):
        serializer.save()
            

"""ya repost ka part hai"""
from django.shortcuts import get_object_or_404
class LCPRepost (generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Repost.objects.filter(profile__isBanned=True)
    serializer_class = SerializerRepost

    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentication credentials were not provided."},
                 status=403
            )
        # yaha self is leya use nahi keya hai ku ka use direct hi access ho saktaha hai
        user = request.user 

        if user.is_superuser or user.is_staff:
            return Response(
                {"error": "You cannot repost."},
                status=403
            )

        # yaha request.data jab front end sa request ati hai to ya sara payload apny ander store kar leyata hai 
        # get sirf direct data base sa id ko get kata hai ka ya id mojude hia ka nahi 
        post_id = request.data.get('post')
        if not post_id:
            return Response(
                {"error": "Post ID is required."},
                 status=400
            )
        # yaha Post id leya likha taky ya sirf post waly table ko chekc kar saky na repost or profile ma 
        # agar id na mily error sa bachnay ka leya 404 likha hai
        post_obj = get_object_or_404(Post,id=post_id)

        already_repost =Repost.objects.filter (
            user=user,
            post=post_obj
        ).first()

        # step 1 :remove repost
        if already_repost:
            # phaly repost ko delete karo agar kar raki hai to 
            already_repost.delete()
            # ab post ma sa ik minus karo 
            # F() function se count minus karna (race condition se bachne ke liye)
            Post.objects.filter(id=post_obj.id, repost__gt=0).update(repost=F('repost') - 1)
            post_obj.refresh_from_db(fields=['repost'])

            # ya count ka function hai 
            Broadcast(home_room(), 'send_live_data', {
                'kind': 'repost',
                'post_id': post_obj.id,
                'count': post_obj.repost,
            })
            # ya remove function hai 
            Broadcast(home_room(), 'send_live_data', {
                'kind': 'repost_removed',
                'post_id': post_obj.id,
                'username': user.username,
            })
            return Response({
                'message':"repost remove kar di gye hia"
            },status=200)

        # step 2 :create repost
        else:
            repost_obj = Repost.objects.create(
                user=user,
                post=post_obj,
                profile=user.profile
            )
            
            # f() ya is kam hai agar 2 use ik sath like kary to ya dirct sql ko use kartahia 
            Post.objects.filter(id=post_obj.id).update(repost=F('repost') + 1)
            # ya refresh_from_db ya sirf pory databse ma say repost k  nikal lay ga 
            post_obj.refresh_from_db(fields=['repost'])

            #count bhejne ke liye broadcast
            Broadcast(home_room(), 'send_live_data', {
                'kind': 'repost',
                'post_id': post_obj.id,
                'count': post_obj.repost,
            })
            
            # dikhane ke liye sirf yeh chota sa simple data bhej dein
            Broadcast(home_room(), 'send_live_data', {
                'kind': 'repost_created',
                'payload': {
                    'post_id': post_obj.id,
                    'username': user.username,
                    'userpic': user.profile.image.url if hasattr(user, 'profile') and user.profile.image else None,
                },
            })
            
            return Response({'message': "repost add kar di gye hia"}, status=200)


# ya part repost ko delete karna ka leya hai 
class DURRepost (generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [OwnerOrAdmin]
    queryset = Repost.objects.all()
    serializer_class = SerializerRepost
    lookup_field = 'pk'

"""ya part comment ka leya hai """
class LCPComment (generics.ListCreateAPIView):
    serializer_class = SerializerComment
    
    # yaha par data kis tarha show karna hai 
    def get_queryset(self):
        post_id = self.request.query_params.get('post_id')
        if post_id:
            return Comment.objects.filter(post_id=post_id , parent=None).order_by('created_at')
        return Comment.objects.filter(parent=None).order_by('created_at')       

    def perform_create(self, serializer):
        user = self.request.user
        if not(user.is_active):
            raise PermissionDenied('only user hi comment kar sakty hai ')
    
        comment = serializer.save(user=user)

        Post.objects.filter(id=comment.post_id).update(comment=F('comment') + 1)
        post = Post.objects.get(id=comment.post_id)

        payload = SerializerComment(comment, context={'request': self.request}).data
        Broadcast(home_room(), 'send_live_data', {
            'kind': 'comment',
            'post_id': post.id,
            'count': post.comment,
            'comment': payload,
            'parent_id': comment.parent_id,
        })

# ya part comment ko delete karna ka leya hai 
class DURComment (generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [OwnerOrAdmin]
    queryset = Comment.objects.all()
    serializer_class = SerializerComment
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        post = instance.post
        comment_id = instance.id
        parent_id = instance.parent_id
        
        total_delete = 1 + comment_count_all(instance)
        
        instance.delete()

        if post:
            if post.comment >= total_delete:
                post.comment -= total_delete
            else:
                post.comment = 0
            post.save(update_fields=['comment'])

            Broadcast(home_room(), 'send_live_data', {
                'kind': 'comment_deleted',
                'post_id': post.id,
                'count': post.comment,
                'comment_id': comment_id,
                'parent_id': parent_id,
            })

"""ya part like ka hai """
class LCPLike (generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = post_like.objects.all()
    serializer_class = SerializerLike

    def post(self, request, *args, **kwargs):
        post_id = request.data.get('post')
        if not post_id:
            return Response({"error": "Post ID is required."}, status=400)

        post = get_object_or_404(Post, id=post_id)
        user = request.user

        if user.is_superuser or user.is_staff:
            return Response({"error": "You cannot like."}, status=403)
        
        already_like = post_like.objects.filter(user=user, post=post).first()

        if already_like:
            already_like.delete()
            Post.objects.filter(id=post.id, like__gt=0).update(like=F('like') - 1)
        else:
            post_like.objects.create(user=user, post=post)
            Post.objects.filter(id=post.id).update(like=F('like') + 1)

        post.refresh_from_db(fields=['like'])

        Broadcast(home_room(), 'send_live_data', {
            'kind': 'like',
            'post_id': post.id,
            'count': post.like,
            'user_id': user.id,
        })
        return Response({'like': post.like})

# ya part like ko delete karny kaleya hai
class DURLike (generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [OwnerOrAdmin]
    queryset = post_like.objects.all()
    serializer_class = SerializerLike
    lookup_field = 'pk'

"""ya part view karny ka leya hai """
from django.utils import timezone
from datetime import timedelta

class LCPView(generics.ListCreateAPIView):
    queryset = view_Post.objects.all()
    serializer_class=SerializerView

    def post(self, request, *args, **kwargs):
        post_id = request.data.get('post')
        post = Post.objects.get(id=post_id)

        user = request.user
        five_min_age = timezone.now() - timedelta(minutes=5)

        already_view = view_Post.objects.filter(
            post=post,
            user=user,
            create_view__gte = five_min_age,
        ).exists()

        if already_view :
            return Response(({'message': 'timeup'}))
        
        else:
            view_Post.objects.create(
            post=post,
            user=user,                
            )
            post.views +=1
            post.save()
            
            # consumer part hai  ya
            Broadcast('home_feed', 'send_live_data', {
                'kind': 'view',
                'post_id': post.id,
                'count': post.views,
            })
        return Response(({'message': 'Count view'}))

class DURView(generics.RetrieveUpdateDestroyAPIView):
    queryset = view_Post.objects.all()
    serializer_class=SerializerView
    lookup_field = "pk"
    
"""ya prat post hidden ka hai """
class LCPHidden(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = HiddenPost.objects.all()
    serializer_class = SerializerHidden

    def perform_create(self, serializer):
        user = self.request.user
        post = serializer.validated_data["post"]

        if post.profile.user == user:
            raise PermissionDenied("You cannot hide your own post.")
        serializer.save(user=user)

# ya part hiddenpost ko delete karna ka leya hai 
class DURHidden (generics.RetrieveUpdateDestroyAPIView):
    permission_classes =[OwnerOrAdmin]
    queryset = HiddenPost.objects.all()
    serializer_class = SerializerHidden
    lookup_field = 'pk'

"""ya prat banner ka hai """
class LCPBanner (generics.ListCreateAPIView):
    permission_classes =[IsSuperUserOrReadOnly]
    queryset = Banner.objects.all()
    serializer_class = SerializerBanner

# ya part bannner ko delete karna ka leya hai 
class DURBanner (generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdmin]
    queryset = Banner.objects.all()
    serializer_class = SerializerBanner
    lookup_field = 'pk'

# ya login kary or data ko access karny ka leya hai 
from rest_framework_simplejwt.views import TokenObtainPairView
class LCPToken (TokenObtainPairView):
    serializer_class = AccesTokenSerializer


''' ya part profile ki logo image kaleya hai '''
class SpecificLCPProfile(generics.ListCreateAPIView):
    permission_classes = [IsSuperUserOrReadOnly]
    serializer_class = SerializerProfile

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Profile.objects.filter(user=self.request.user)

        return Profile.objects.none()

"""ya prat profile ka hai """
class LCPProfile (generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Profile.objects.all()
    serializer_class = SerializerProfile

# ya part profile ko delete karna ka leya hai 
class DURProfile(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdmin]
    queryset = Profile.objects.all()
    serializer_class = SerializerProfile
    lookup_field = 'user'

    def perform_update(self, serializer):
        # sub sy profile ka old data nikalo jo update nahi howa hai
        profile_old_status = self.get_object().isBanned

        # is ma front end sy aye howy data ko save kar do 
        profile_isBanned = serializer.save()

# ab condition sa check karo ka use pahly bann tha phir unbann howa hia
        if profile_old_status == False and profile_isBanned.isBanned == True:
            # ab new profile ka data ma  user ko nikalo
            user = profile_isBanned.user

            # ab check kaor kd already exists karta hai ya nahi
            evaluations = Evaluation.objects.filter(
                post__user=user
            )
            # ab sub sy phaly hum sary evalution ko save karty hia
            for evaluation in evaluations:
                # ab evalutoion ka ander jo post ki id hia use post ko bhai delete karo do
                evaluation.post.delete()

        

"""ya prat profile ka hai """
class LCPProfileBanned (generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = SerializerProfile

    def get_queryset(self):
        user = self.request.user

        if not user.is_authenticated:
            return Profile.objects.none()
            
        if user.is_superuser or user.is_staff:
            return Profile.objects.filter(isBanned = False)
        
        return Profile.objects.filter(user=user,isBanned = False)



""" ya part User model hia ka leya hai """
class LCPUser (generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer


# ya user ko delete karny ka leya hia
class DURUser (generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdmin]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'pk'


""" ya part FeedBack ka leya hai """
class LCPFeedBack (generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = FeedBack.objects.all()
    serializer_class = SerializerFeedBack

# ya part FeedBack ko delete karna ka leya hai 
class DURFeedBack (generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [OwnerOrAdmin]
    queryset = FeedBack.objects.all()
    serializer_class = SerializerFeedBack
    lookup_field = 'pk'

""" ya part Support ka leya hai """
class LCPSupport (generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Support.objects.all()
    serializer_class = SerializerSupport

# ya part Support ko delete karna ka leya hai 
class DURSupport (generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [OwnerOrAdmin]
    queryset = Support.objects.all()
    serializer_class = SerializerSupport
    lookup_field = 'pk'

""" ya Chat karna ka leya hai """
class LCPChat (generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Chat.objects.all()
    serializer_class = SerializerChat
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        chat = serializer.instance
        payload = SerializerChat(chat, context={'request': self.request}).data
        Broadcast(chat_room(chat.conversations_id), 'send_live_data', {
             'kind': 'chat',
             'payload': payload,
         })

# ya part Chat ko delete karna ka leya hai 
class DURChat (generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [PrivateOwnerOrAdmin]
    queryset = Chat.objects.all()
    serializer_class = SerializerChat
    lookup_field = 'pk'

""" ya part conversation ka leya hai """
class LCPConversation (generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SerializerConversation
    def get_queryset(self):
        queryset = Conversation.objects.all()
        # user id ko get karna
        user_id = self.request.query_params.get("user")
        if user_id:
            queryset = Conversation.objects.filter(user_id=user_id)
        return queryset
    
# ya part Conversation ko delete karna ka leya hai 
class DURConversation (generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [PrivateOwnerOrAdmin]
    queryset = Conversation.objects.all()
    serializer_class = SerializerConversation
    lookup_field = 'pk'

""" ya Annoucement ka leya hai """
class LCPAnnoucement (generics.ListCreateAPIView):
    permission_classes = [IsSuperUserOrReadOnly]
    queryset = Annoucement.objects.all()
    serializer_class = SerializerAnnoucement

# ya part Annoucement ko delete karna ka leya hai 
class DURAnnoucement (generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsSuperUserOrReadOnly]
    queryset = Annoucement.objects.all()
    serializer_class = SerializerAnnoucement
    lookup_field = 'pk'


""" ya part Artical ka leya hai """
class LCPArtical (generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Artical.objects.all()
    serializer_class = SerializerArtical
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# ya part Artical ko delete karna ka leya hai 
class DURArtical (generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [OwnerOrAdmin]
    queryset = Artical.objects.all()
    serializer_class = SerializerArtical
    lookup_field = 'pk'

""" ya part Artical Advertisement ka leya hai """
class LCPAdvertisement (generics.ListCreateAPIView):
    permission_classes = [IsSuperUserOrReadOnly]
    queryset = ArticalAdvertisement.objects.all()
    serializer_class = SerializerAdvertisement

""" ya part suggestion ka leya hai """
class LCPSuggestion (generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Suggestion.objects.all()
    serializer_class = SerializerSuggestion

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# ya part Artical ko delete karna ka leya hai 
class DURSuggestion (generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [OwnerOrAdmin]
    queryset = Suggestion.objects.all()
    serializer_class = SerializerSuggestion
    lookup_field = 'pk'

"""ya part conversation group ka hia """
class LCPConversationGoup (generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Converstion_group.objects.all()
    serializer_class = SerializerConversationGroup

# ya converstion ko delete kary kaleya 
class DURConversationGoup (generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Converstion_group.objects.all()
    serializer_class = SerializerConversationGroup
    lookup_field = 'pk'

"""ya part group chat ka leya hia """
class LCPGroupChat (generics.ListCreateAPIView):
    permission_classes  = [IsAuthenticated]
    serializer_class = SerializerGroupChat

    def get_queryset(self):
        queryset = Group_Chat.objects.all()
        conversation_id = self.request.query_params.get('conversation')
        if conversation_id:
            queryset = Group_Chat.objects.filter(conversation_id=conversation_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        chat = serializer.instance
        payload = SerializerGroupChat(chat, context={'request': self.request}).data
        
        Broadcast(group_room(chat.conversation_id), 'send_live_data', {
            'kind': 'group_chat',
            'payload': payload,
        })

        
# ya part chat ko delete karny ka leya hai
class DURGroupChat (generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Group_Chat.objects.all()
    serializer_class = SerializerGroupChat
    lookup_field = 'pk'

"""ya part sirf user ko create karny ka leya hai"""
class LCPCreateUser (generics.ListCreateAPIView):
    permission_classes = [IsAdmin]
    serializer_class = SerializerUserProfile

    def get_queryset(self):
        user = self.request.user
        if not user.is_superuser or user.is_staff:
            return Profile.objects.none()
        if user.is_superuser or user.is_staff:
            return Profile.objects.filter(user=user)


"""ya part evalution ka hai"""
class LCPEvalution (generics.ListCreateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Evaluation.objects.all()
    serializer_class = SerializerEvaluation

""" ya part Report_roll ka leya hai """
class LCPReportroll (generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Report_roll.objects.all()
    serializer_class = SerializerReportroll

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# ya part Support ko delete karna ka leya hai 
class DURReportroll (generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdmin]
    queryset = Report_roll.objects.all()
    serializer_class = SerializerReportroll
    lookup_field = 'pk'

""" ya part Subscription ka leya hai """
class LCPSubscription (generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SerializerSubscription

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_staff:
            return Subscription.objects.all().order_by('-start_package')
        return Subscription.objects.filter(user=user).order_by('-start_package')

    def perform_create(self, serializer):
        # phaly frontend say any waly pakege ko nakal na hai
        # yaha par serilizer.validated_data ka matlab hai wo data jo serializer ka sary rule flow ka ka aya hai 
        subscription_type = serializer.validated_data.get(
            'package_duration',self.request.data.get('package_duration')
            )
        
        # ab check kar hai ka kon sa package hai or kity din banty hai
        day_map = {"1 Month":30,"3 Months":90,"9 Months":270}
        day = day_map.get(subscription_type ,30)
        

        # phaly abhi ka time naklo
        time_now = timezone.now()

        # phir use ma pakage ka mutabik aj say laky end package day tak add karo 
        expire_at = time_now + timedelta(days=day)

        # ab phaly sy active subsction ko deactivate krna hai 
        Subscription.objects.filter(user=self.request.user,is_active=True).update(is_active=False)

        # ab new subscription ko add karna hi 
        serializer.save(
            user=self.request.user,
            start_package= time_now,
            expire_package = expire_at,
            package_duration = subscription_type,
            is_active=True
            )

# ya part Subscription ko delete karna ka leya hai 
class DURSubscription (generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [OwnerOrAdmin]
    queryset = Subscription.objects.all()
    serializer_class = SerializerSubscription
    lookup_field = 'pk'

""" ya part post limit per day ka leya hai """
class LCPostLimit (generics.ListCreateAPIView):
    permission_classes= [IsAdmin]
    queryset = Post_limit.objects.all()
    serializer_class = SerializerPostLimit

    def get_queryset(self):
        user =self.request.user
        if not user.is_superuser and user.is_staff:
            return Post_limit.objects.none()
        elif user.is_active:
            return Post_limit.objects.none()
        return Post_limit.objects.all()

# 1. Notification create 
class LCNotification(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SerializerNotification

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Notification.objects.all().order_by('-created_at')
        return Notification.objects.filter(user=user).order_by('-created_at')


# 2. Notification Delete
class DURNotification(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SerializerNotification

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Notification.objects.all()
        return Notification.objects.filter(user=user)