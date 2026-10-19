from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

""" ya part login ka leya hia """
class AccesTokenSerializer (TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['is_staff'] = self.user.is_staff
        data['is_active'] = self.user.is_active
        data['is_superuser'] = self.user.is_superuser
        return data

"""ya part profile ka leya hai"""
class SerializerProfile(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source="user.username" ,read_only=True )
    email = serializers.ReadOnlyField(source="user.email" ,read_only=True )
    id = serializers.ReadOnlyField(source="user.id" ,read_only=True )
    post = serializers.SerializerMethodField()
    class Meta:
        model = Profile
        fields = '__all__'
        read_only_fields = ['user']

    def get_post(self,obj):
        return Post.objects.filter(user=obj.user).count()



"""yaha par comment ka child / replies coutn ho gy"""
def comment_count_all(comment):
    total =0
    for reply in comment.replies.all():
        total += 1
        total += comment_count_all(reply)
    return total
        
"""ya post ka serializer hai or is sy user banned or unbanned hota hai """
class SerializerPost (serializers.ModelSerializer):
    # ma user.user ka through sirf ik field ko access kar sakta ho 
    username = serializers.ReadOnlyField(source = 'user.username' ,read_only=True,required=False)
    email = serializers.ReadOnlyField(source = 'user.email',read_only=True,required=False)
    # hum image oko direct ReadOnlyField ka zarya send nahi kar sakty hai ku ka 
    # ka ya binory jasy 00 #oo #0 fomate ha hoti ha lakin DRF sirf string strings, numbers, booleans, arrays, objects
    # ko hi smghta hai 
    userPic = serializers.ImageField(source = 'profile.userPic',read_only=True , required =False)
    # ab is part ka through ma front end sy menually isBanned ko update kar sakta ho
    isBanned = serializers.BooleanField (source ='profile.isBanned', required= False )
    Status = serializers.CharField(source='profile.Status', required=False)
    risk = serializers.CharField(source='profile.risk', required=False)
    # yaha sa like /comment/view ka count shuru hota hai
    comment_count = serializers.SerializerMethodField()
    is_like = serializers.SerializerMethodField()
    is_repost = serializers.SerializerMethodField()

    # meta ka through hum additional information add kar sakty hai
    class Meta:
        model = Post
        fields = [
            'id',
            'user',
            'profile',
            'username',
            'email',
            'userPic',
            'text',
            'image1',
            'image2',
            'image3',
            'image4',
            'image5',
            'image6',
            'paypal',
            'phone',
            'isActive',
            'comment',
            'like',
            'repost',
            'views',
            'createdat',
            'comment_count',
            'isBanned',
            'anonymous',
            "Status",
            'risk',
            "is_like",
            "is_repost"
        ]
        read_only_fields = ['user', 'profile']

    # yaha par mughy annoymous post ki privacy ya post masking lagna hia bad ma
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if getattr(instance,'anonymous',False):
            data['username'] = 'anonymous'
            data['email'] = 'anonymous@gmail.com'
            data['userPic'] = None
            data['user'] = None
            data['profile'] = None
        return data

# ya par sub ko count kary ga
    def get_comment_count(self,obj):
        return obj.comment_post.count()


# ya show karta hai ka post kis user  na like ki hai matlab color chage karta hia
    def get_is_like(self, obj):
        request = self.context.get('request')
        
        # Agar user login hai aur post_like table mein yeh post aur user mojood hain toh True de do
        if request and request.user and request.user.is_authenticated:
            return post_like.objects.filter(post=obj, user=request.user).exists()
        return False


# ya show karta hai ka post kis user  na like ki hai matlab color chage karta hia
    def get_is_repost (self,obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Repost.objects.filter(user=request.user, post=obj).exists()
        return False    
        
    # yaha sy main login shuru hoti hai 
    def update(self, instance, validated_data):
        # phaly nested data ko nikal ty ha jo ka parent ka hota hai 
        Profile_isBanned = validated_data.pop('profile',{})

        # login user
        request = self.context.get('request')
        user = getattr(request,'user',None)

        # check karo ka user user super_user hai agar hai to wo risk or status or bann kar sakta hai or koi user nahi kar saktahia 
        is_admin = (
            user and user.is_authenticated and (user.is_staff or user.is_superuser)
        )
        if not is_admin:
            Profile_isBanned={}
            validated_data.pop('isActive', None)

        instance = super().update(instance, validated_data)
        # ab error na ay is leya conditon laga raha ho 
        if Profile_isBanned and hasattr(instance,'profile'):
              if 'isBanned' in Profile_isBanned:
                  instance.profile.isBanned = Profile_isBanned.get('isBanned')
              if 'Status' in Profile_isBanned:
                  instance.profile.Status = Profile_isBanned.get('Status')
              if 'risk' in Profile_isBanned:
                  instance.profile.risk = Profile_isBanned.get('risk')
              instance.profile.save()
        return instance

"""ya part hidden post ka leya hia """
class SerializerHidden (serializers.ModelSerializer):
    Username = serializers.ReadOnlyField(source = 'user.username',read_only=True)

    class Meta :
        model = HiddenPost
        fields = '__all__'

"""ya section repost ka hai """
class SerializerRepost (serializers.ModelSerializer):
    # post = SerializerPost(read_only=False)
    # uper waly ko replace keya ku ka repsot ko post ki id chaiya hai 
    
    # or is ms queryset is leya use keya taky pata chal saky id jo
    # front end sa a rahi keay wo database ma mojude hai ya phir nahi
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())
 
# detail
    Username = serializers.ReadOnlyField(source = 'user.username',read_only=True)
    Email = serializers.ReadOnlyField(source = 'user.email',read_only=True)
# image
    Userpic = serializers.ImageField(source = 'profile.userPic',read_only=True , required =False)

    class Meta:
        model = Repost
        fields = '__all__'
        read_only_fields = ['user', 'profile']


"""ya section comment ka leya hai """
class SerializerComment (serializers.ModelSerializer):
    # detail
    Username = serializers.ReadOnlyField(source = 'user.username')
    Email = serializers.ReadOnlyField(source = 'user.email')
# image
    userPic = serializers.ImageField(source = 'user.profile.userPic',read_only=True , required =False)
# is field ka name kuch bhi rakh sakty hai 
# lakin jo name rakho ga wo hi funciton get ka sath use karn hai 
    replies = serializers.SerializerMethodField()

    class Meta :
        model = Comment
        fields = '__all__'
    # ya function front end par child replies ko serialize kar sa send kary ga ager child replies ho to 
    def get_replies(self,obj):
        if obj.replies.exists():
            return SerializerComment(obj.replies.all().order_by('created_at') , context=self.context ,many=True).data
        return []
    
"""ya part like ka leya hia """
class SerializerLike (serializers.ModelSerializer):
    Username = serializers.ReadOnlyField(source = 'user.username',read_only=True)
    post = serializers.ReadOnlyField(source = 'post.id',read_only=True)

    class Meta :
        model =post_like
        fields = '__all__'

"""ya part view ka leya hia"""    
class SerializerView (serializers.ModelSerializer):
    Username = serializers.ReadOnlyField(source = 'user.username',read_only=True)
    post = serializers.ReadOnlyField(source = 'post.id',read_only=True)
    class Meta :
        model = view_Post
        fields = '__all__'


"""ya section banner ka hai"""
class SerializerBanner (serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = '__all__'


""" ya feedback serializer hai """
class SerializerFeedBack (serializers.ModelSerializer):
    class Meta:
        model = FeedBack
        fields = "__all__"

""" ya Support serializer hai """
class SerializerSupport(serializers.ModelSerializer):
    class Meta:
        model = Support
        fields = '__all__'

""" ya Artical advertisement serializer hai """
class SerializerAdvertisement (serializers.ModelSerializer):
    class Meta:
        model= ArticalAdvertisement
        fields = '__all__'

""" ya artical serializer hai """
class SerializerArtical (serializers.ModelSerializer):
    Username = serializers.ReadOnlyField(source = 'user.username',read_only=True)
    class Meta:
        model = Artical
        fields = '__all__'
        read_only_fields = ['user']

""" ya Chat serializer hai """
class SerializerChat (serializers.ModelSerializer):
    IsSuperUser = serializers.ReadOnlyField(source='user.is_superuser')
    IsActive = serializers.ReadOnlyField(source='user.is_active')
    Username = serializers.ReadOnlyField(source = 'user.username',read_only=True)  
    class Meta:
        model = Chat
        fields = "__all__"
        read_only_fields = ['user']


""" ya conversation serializer hai """
class SerializerConversation(serializers.ModelSerializer):
    Username = serializers.ReadOnlyField(source = 'user.username',read_only=True)  
    chat = SerializerChat(source = "chat_conversation" , read_only = True ,many=True)
    class Meta:
        model = Conversation
        fields = "__all__"

""" ya suggestion serializer hai """
class SerializerSuggestion (serializers.ModelSerializer):
    Username = serializers.ReadOnlyField(source = 'user.username',read_only=True) 
    class Meta:
        model = Suggestion
        fields = '__all__'
        read_only_fields = ['user']

""" ya Announcement serializer hai """
class SerializerAnnoucement (serializers.ModelSerializer):
    userPic = serializers.ImageField(source = 'profile.userPic',read_only=True , required =False)
    status = serializers.ReadOnlyField(source = 'profile.Status',read_only=True , required =False)
    Username = serializers.ReadOnlyField(source = 'user.username',read_only=True)  
    email = serializers.ReadOnlyField(source = 'user.email',read_only=True)  
    class Meta:
        model = Annoucement
        fields = "__all__"
        read_only_fields = ['user','profile']

"""ya user Serializer hai """
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff', 'is_superuser']
        # is sa hum fake joinig sa bach sakty hai ya check karta hai ka user real hai ya fake
        read_only_fields = ['date_joined']

"""ya part group chat ka hai """
class SerializerGroupChat(serializers.ModelSerializer):
    Username = serializers.ReadOnlyField(source = 'user.username',read_only=True) 
    userPic = serializers.ImageField(source = 'user.profile.userPic',read_only=True , required =False)
    class Meta:
        model = Group_Chat
        fields = "__all__"
        read_only_fields = ['user','profile']

"""ya part conversation_group ka hia"""
class SerializerConversationGroup(serializers.ModelSerializer):
    group_chat = SerializerGroupChat(source = 'Group_chat' , read_only=True , many=True)
    class Meta:
        model = Converstion_group
        fields = '__all__'




"""ya part user creat karny kal leya hai """
class SerializerUserProfile(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    username = serializers.CharField(write_only=True,required=False)
    email = serializers.CharField(write_only=True,required=False)
    password = serializers.CharField(write_only=True,required=False)

    class Meta:
        model = Profile
        fields = "__all__"

     # """
     # agar ma uper wala na likna chat ho to 
     # user = validated_data.pop('user',{})
     # ma is say direct likh sakta ho
     # """   
    def validate(self, attrs):
        data = super().validate(attrs)
        username = data.get('username')
        email = data.get('email')

        if username and User.objects.filter(username=username).exists():
            raise serializers.ValidationError({
                 'username':"this username already existis"
            })
        
        if email and User.objects.filter(email=email).exists():
            raise serializers.ValidationError({
                 'email':"this email already existis"
            })
        return data
        
    # yaha par user create or  nesting data intery ka leya code likha hia 
    def create(self,validated_data):
        # is tarha ma ik ik field ko alag validate_data ma say nikal variable dal raha ho 
        username = validated_data.pop('username',None)
        email = validated_data.pop('email',None)
        password = validated_data.pop('password',None)

        # agar ma uper wala na likna chat ho to 
        # user = validated_data.pop('user',{})
        # ma is say direct likh sakta ho
        
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )
        profile = Profile.objects.create(
            user=user,
            **validated_data
        )
        return profile


"""ya Evaluation serializer hai"""
class SerializerEvaluation(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = '__all__'

# is ka kam hai data ko json ma convet karna 
    def to_representation(self, instance):
        data = super().to_representation(instance)
        
        # evalutin ma sa post ka data nikalna hia
        post = instance.post
        # # ab is Post ko SerializerPost se JSON data mein convert karo
        Post_data = SerializerPost(
            post,
            context = self.context
        ) 
        # ab json data ko ik variabal ma save karo
        Post_all_data = Post_data.data

        # ab evalution ki post ka complte data rakh do taky fornt end par (items.post.fieldname) likh sako
        data['post'] = Post_all_data

        return data

"""ya part report ka leya hai """
class SerializerReportroll (serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Report_roll
        fields = "__all__"
        read_only_fields= ['user']

"""ya part Subscription ka leya hai """
class SerializerSubscription (serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Subscription
        fields = "__all__"
        read_only_fields = ['user', 'is_active', 'start_package', 'expire_package']

"""ya part Post limit par day ka leya hai """
class SerializerPostLimit (serializers.ModelSerializer):
    class Meta:
        model = Post_limit
        fields = '__all__'

"""ya part Notification par day ka leya hai """
class SerializerNotification (serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['created_at', 'user']
