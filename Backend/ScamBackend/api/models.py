from django.db import models
from django.contrib.auth.models import User
import random

# Create your models here.


# ya ya profile model
STATUS_CHOICES = [
        ("Active", "Active"),
        ("Inactive", "Inactive"),
        ("Pending", "Pending"),
        ("Banned", "Banned"),
    ]
RISK_CHOICES = [
        ("High", "High"),
        ("Medium", "Medium"),
        ("Low", "Low"),
        ("Not Flagged", "Not Flagged"),
    ]

class Profile (models.Model):

    # yaha par ma bultin user model user kar raha ho
    user = models.OneToOneField(User ,on_delete=models.CASCADE , related_name='profile')
    # user image 
    userPic = models.ImageField(upload_to='UserPic' , null=True , blank=True)
    # ya part user ka status or risk batata hai  
    risk = models.CharField(max_length=50 , choices=RISK_CHOICES , default="Not Flagged" )
    Status = models.CharField(max_length=50 , choices=STATUS_CHOICES , default="Active")
    # is sy user ki sary ki sary post bann ho gati hai 
    isBanned = models.BooleanField(default=False)
    
    CreatedAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"UserName = {self.user.username} || status = {self.Status} || risk = {self.risk}"


# ya home page banner ka model hia 
class Banner (models.Model):
    title = models.CharField(max_length=50, null=True , blank=True)
    banner_image = models.ImageField(upload_to='BannerImage',null=True , blank=True)
    banner_url = models.URLField(max_length=500)
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f'ya add ka title hai = {self.title}'


# randon id create karny kaleya 
def PostID():
    return random.randint(100000, 999999)
# ya home page par post karny ka leya hai 
class Post (models.Model):
    # ya profile ka password and user ...
    user = models.ForeignKey(User , on_delete=models.CASCADE , related_name='user_part' )
    # ya profile ki other information ka part hai
    profile = models.ForeignKey(Profile , on_delete=models.CASCADE , related_name='profile_part')
    # random id 
    id = models.IntegerField(default=PostID , editable=False , primary_key=True)
    # ya post ki information ka part hai
    text = models.TextField()
    image1 = models.ImageField(upload_to='Post',null=True,blank=True)
    image2 = models.ImageField(upload_to='Post',null=True,blank=True)
    image3 = models.ImageField(upload_to='Post',null=True,blank=True)
    image4 = models.ImageField(upload_to='Post',null=True,blank=True)
    image5 = models.ImageField(upload_to='Post',null=True,blank=True)
    image6 = models.ImageField(upload_to='Post',null=True,blank=True)
    paypal = models.CharField(max_length=100 , null=True , blank=True)
    phone = models.CharField(max_length=100 , null=True , blank=True)
    isActive = models.BooleanField(default=False)
    anonymous = models.BooleanField(default=False)
    comment = models.PositiveIntegerField (default=0)
    like = models.PositiveIntegerField(default=0)
    repost = models.PositiveIntegerField(default=0)
    views = models.PositiveIntegerField(default=0)

    #  ya filed premium ko check karny ka leya hai 
    is_premium = models.BooleanField(default=False)
    # yaha par date ki field
    createdat = models.DateTimeField(auto_now_add=True , null=True , blank=False)

    # random key ke duplication sa buchny ka leya 
    def save(self,*args,**kwargs):
        if not self.id :
            while True:
                new_id = PostID()
                if not Post.objects.filter(id=new_id).exists():
                    self.id = new_id
                    break
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"kis user na post ki hai = {self.user} || id = {self.id}"

"""ya part post ko hidden karny ka leya hia """
class HiddenPost (models.Model):
    user = models.ForeignKey(User , on_delete=models.CASCADE , related_name='hidden_user' , null=True , blank=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE , related_name='hidden_part', null=True , blank=True)
    create_at_hidden = models.DateTimeField(auto_now_add=True) 

"""ya random id ko get karny ka leya hai """
def RepostID ():
    return random.randint(100000, 999999)

# ya repost ka model hai
class Repost (models.Model):
    id = models.IntegerField(default=RepostID , primary_key=True , editable=False )
    # ya profile ka password and user ...
    user = models.ForeignKey(User , on_delete=models.CASCADE , related_name='repost_user' , null=True , blank=True)
    # ya profile ki other information ka part hai
    profile = models.ForeignKey(Profile , on_delete=models.CASCADE , related_name='repost_profile' , null=True , blank=True)
    # ya post ki informaiton ko access karny ka leya hai
    post = models.ForeignKey(Post, on_delete=models.CASCADE , related_name='Post_part', null=True , blank=True)

    timestamp = models.DateTimeField(auto_now_add=True ,  null=True , blank=True)

    class Meta:
            unique_together = ('post', 'user')
            
    def __str__(self):
        return f"kis user na Repost keya hai = {self.user.username} || id = {self.id}"
    def save(self,*args , **kwargs):
        if not self.id:
            self.id = RepostID()
            while Repost.objects.filter(id=self.id).exists():
                self.id = RepostID()
        return super().save(*args , **kwargs)


# ya Model comment section ka hai 
class Comment (models.Model):
    # ya profile ka password and user ...
    user = models.ForeignKey(User , on_delete=models.CASCADE , related_name='comment_user' , null=True , blank=True)
    # post ki id ko save karny ka leyahai 
    post = models.ForeignKey(Post, on_delete=models.CASCADE , related_name='comment_post', null=True , blank=True)
    # kudh ki id ko save karny ka leya 
    parent = models.ForeignKey('self', on_delete=models.CASCADE, related_name='replies', null=True, blank=True)

    message = models.CharField(max_length=500 )
    created_at = models.DateTimeField(auto_now_add=True , null=True , blank=True)

    def __str__(self):
        return f"user = Anonymous || id = {self.id} || message = {self.message}"

# ya Model  like ka leya hai 
class post_like (models.Model):
    # post ki id ko save karny ka leyahai 
    post = models.ForeignKey(Post, on_delete=models.CASCADE , related_name='like_post', null=True , blank=True)
    # ya profile ka password and user ...
    user = models.ForeignKey(User , on_delete=models.CASCADE , related_name='like_user' , null=True , blank=True)
    create_like = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'user')

#ya Model view ka leya hai 
class view_Post (models.Model): 
    # post ki id ko save karny ka leyahai 
    post = models.ForeignKey(Post, on_delete=models.CASCADE , related_name='View_post', null=True , blank=True)
    # ya profile ka password and user ...
    user = models.ForeignKey(User , on_delete=models.CASCADE , related_name='View_user' , null=True , blank=True)
    create_view = models.DateTimeField(auto_now_add=True)


# Suggestions Model
class Suggestion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="suggestions")
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {self.user.username}"


# support Model hai
class Support (models.Model):
    email = models.EmailField(max_length=200 )
    subject = models.CharField(max_length=300)
    message = models.TextField()

    def __str__(self):
        return f'Subject = {self.subject} and email by {self.email}'


# Annoucement Model
class Annoucement (models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="annoucement")
    profile = models.ForeignKey(Profile , on_delete=models.CASCADE , related_name='annoucment_profile' , null=True , blank=True)
    title = models.CharField(max_length=100)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"created by {self.user.username} and title = {self.title}"

# Artical model
class Artical (models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="artical")
    artical_title = models.CharField(max_length=300)

    introduce = models.CharField(max_length=100 , null=True,blank=True)
# its first artical section 
    pic1 =  models.ImageField(upload_to="artical_image")
    detail1 = models.TextField()

    title = models.CharField(max_length=100 , null=True , blank=True)
# its second artical section 
    pic2 =  models.ImageField(upload_to="artical_image")
    detail2 = models.TextField()

    def __str__(self):
        return f"{self.user} title = {self.artical_title}"

#Artical Advertisement Model
class ArticalAdvertisement (models.Model):
    title = models.CharField(max_length=50, null=True , blank=True)
    artical_image = models.ImageField(upload_to='aetical_advertisement',null=True , blank=True)
    artical_url = models.URLField(max_length=500)
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f'ya add ka title hai = {self.title}'


# feedback model
class FeedBack (models.Model):
    message = models.TextField()



# first: Conversation Between admin and Blacklist user Model 
class Conversation (models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="conversation")
    def __str__(self):
        return f"{self.user}"      

# second : conversation
class Chat (models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="Chat")
    conversations = models.ForeignKey(Conversation ,related_name='chat_conversation', on_delete=models.CASCADE , null=True , blank=True) 
    text = models.CharField(max_length=300)
    created_at = models.TimeField(auto_now_add=True , null=True , blank=True)
    def __str__(self):
        return f"{self.user}"


# ya part group ka ley hia
class Converstion_group (models.Model):
    user = models.ManyToManyField(User, related_name="Group")
    isActive = models.BooleanField(default=False , null=True,blank=True)
    Group_title = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.user} : {self.Group_title}"

#ya part group ka ander bat karny ka leya hai 
class Group_Chat (models.Model):
    conversation = models.ForeignKey(Converstion_group , on_delete=models.CASCADE ,related_name="Group_chat")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chat_user")
    profile = models.ForeignKey(Profile , on_delete=models.CASCADE , related_name='chat_profile' , null=True , blank=True)
    text = models.CharField(max_length=500)

    def __str__(self):
        return f"{self.conversation} || {self.user}"

# ya part evalutaion ka leya hai 
class Evaluation(models.Model):
    post = models.OneToOneField(Post, on_delete=models.CASCADE , related_name='evalution_post')

    def __str__(self):
        return f"{self.post}"


# repot & roll Model
class Report_roll(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="Report_user")
    email = models.EmailField(max_length=200 )
    subject = models.CharField(max_length=300)
    message = models.TextField()

    def __str__(self):
        return f"{self.subject}"


# ya model user ki post limit ka leya hai
class Post_limit (models.Model):
    limit_per_day = models.PositiveIntegerField(default=20)

    def __str__(self):
        return f"{self.limit_per_day}"

# ya model Subscription ka leya hai
package = [
    ("1 Month", '1 Month'),
    ("3 Months", '3 Months'),
    ("9 Months", '9 Months'),
]
class Subscription (models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="Subscription_user")
    package_duration = models.CharField(choices=package ,max_length=10)
    start_package = models.DateTimeField(auto_now_add=True)
    expire_package = models.DateTimeField()
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user} || start={self.start_package} || Month={self.package_duration}"


# ya Subscriptions Model hai
NOTIFICATION_TYPES = (
        ('post_like', 'Post Like'),
        ('comment', 'Comment'),
        ('repost', 'Repost'),
        ('chat', 'Chat'),
        ('group', 'Group'),
        ('ban', 'Ban'),
        ('subscription', 'Subscription'),
        ('message', 'Message'),
        ('other', 'Other'),
    )
class Notification (models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="Notification_user")
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, default='other')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=True, blank=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, null=True, blank=True)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, null=True, blank=True)  
    group = models.ForeignKey(Converstion_group, on_delete=models.CASCADE, null=True, blank=True) 
    text = models.CharField(max_length=500)
    is_admin = models.BooleanField(default=False)
    is_User = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} || {self.text}"
    



#  ya admin talash karny ka leya hia 
def get_admin():
    return User.objects.filter(is_superuser=True , is_active=True).first()

"""yaha hum apna signal liky gy"""
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver (post_save , sender=Profile)
def Profile_isBanned (sender, instance, created, **kwargs):
# agar new profile bani ha to yahi sy return kar do
    if created:
        return
    
    # agar nahi to 
    # yaha par instnces ka matlab hia profile
    if instance.isBanned:
        Conversation.objects.get_or_create(
            user=instance.user
        )

        Notification.objects.create(
            user=instance.user,
            notification_type='ban',   
            text=f"ap ki profile High: {instance.risk} risk or policy violations ki waja sy bann kar di gye hai ."
        )

@receiver (post_save, sender=Repost)
def RePost_notfi (sender,instance,created,**kwargs):
    if created:
        post_owner = instance.post.user
        if post_owner != instance.user:
            Notification.objects.create(
                user = post_owner,
                notification_type='repost',
                post=instance.post,   
                text=f"{instance.user.username} reposted your post."
            )

@receiver(post_save, sender=Comment)
def Comment_notfi(sender, instance, created, **kwargs):
    if not created:
        return

    # Reply
    if instance.parent:
        parent_owner = instance.parent.user
        if parent_owner != instance.user:
            Notification.objects.create(
                user=parent_owner,
                notification_type='comment',
                post=instance.post,
                comment=instance,
                text=f"{instance.user.username} ne aap ke comment ka jawab diya hai"
            )
    # Normal comment
    else:
        post_owner = instance.post.user
        if post_owner != instance.user:
            Notification.objects.create(
                user=post_owner,
                notification_type='comment',
                post=instance.post,
                comment=instance,
                text=f"{instance.user.username} ne aap ki post par comment kiya hai"
            )

@receiver (post_save, sender=post_like)
def post_like_notfi(sender,instance,created,**kwargs):
    if created:
        like_user = instance.post.user
        if like_user != instance.user:
            Notification.objects.create(
                user =  like_user,
                notification_type='post_like',  
                post=instance.post,     
                text = f"{instance.user.username} is user na ap ki post ko like keya hai "
            )

@receiver(post_save, sender=Chat)
def chat_notifi(sender, instance, created, **kwargs):
    if not created or instance.conversations is None:
        return
 
    if instance.user.is_superuser:
        Notification.objects.create(
            user=instance.conversations.user,
            notification_type='chat',
            conversation=instance.conversations,
            text=f"Admin sent you a message = {instance.text}",
        )
    else:
        admin = get_admin()
        if not admin:
            return
        Notification.objects.create(
            user=admin,
            notification_type='chat',
            conversation=instance.conversations,
            text=f'new massage from {instance.user} to you',
        )


@receiver (post_save,sender=Group_Chat)
def Group_notifi (sender,instance,created,**kwargs):
    if not created:
        return

    group = instance.conversation
    members = group.user.exclude(id =instance.user.id)
    for member in members:
        Notification.objects.create(
            user = member,
            notification_type='group',     
            group=group,       
            text=f"New message in {group.Group_title} by {instance.user.username}: {instance.text[:50]}",
        )

@receiver (post_save,sender=Converstion_group)
def Create_Group (sender,instance,created,**kwargs):
    if not created:
        return

    group_member = instance.user.all()
    for group_memebers in group_member:
        Notification.objects.create(
            user = group_memebers,
            notification_type='group',      
            group=instance, 
            text = f'{instance.Group_title}ap is group ka memeber hai '
        )

@receiver(post_save, sender=Subscription)
def subscription_notiti(sender, instance, created, **kwargs):
    if created:
        user = instance.user
        
        Notification.objects.create(
            user=user,
            notification_type='subscription',       
            text="Your subscription has been activated successfully!" 
        )


@receiver(post_save, sender=Notification)
def push_notification(sender, instance, created, **kwargs):
    if created:
        from .consumers import Broadcast, notification_room
 
        Broadcast(notification_room(instance.user_id), 'send_live_data', {
            'kind': 'notification',
            'id': instance.id,
            'type': instance.notification_type,
            'text': instance.text,
            'post_id': instance.post_id,                
            'comment_id': instance.comment_id,            
            'conversation_id': instance.conversation_id,  
            'group_id': instance.group_id,
            'is_admin': instance.is_admin,    
            'is_User': instance.is_User,                 
            'created_at': instance.created_at.isoformat() if instance.created_at else None, 
        })