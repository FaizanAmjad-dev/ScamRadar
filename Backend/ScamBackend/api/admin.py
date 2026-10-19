from django.contrib import admin
from .models import *
# ya django ko built in model ko update karny ka leya hai 
from django.contrib.auth.admin import UserAdmin

# Register your models here.

# Django ka builtin model ko update keya hai 
admin.site.unregister(User)

# ab django ke model ma field add karni hai
@admin.register(User)
class AdminModel (UserAdmin):
    add_fieldsets = (
        (None,{
        'fields':('username','email','password1','password2','is_superuser'),
    }),
    )
    list_display = UserAdmin.list_display

#ya admin profile ka leya hai  
@admin.register(Profile)
class AdminProfile (admin.ModelAdmin):
    list_display = (
        'Status',
        'id',
        'risk',
        'isBanned',
        'CreatedAt',
    )
    list_filter = (
        'Status',
        'risk',
        'isBanned',
        'CreatedAt',
    )
    search_fields = (
        'Status',
        'risk',
        'isBanned',
        'CreatedAt',
    )


# ya post ka model hai 
@admin.register(Post)
class ModelPost (admin.ModelAdmin):
    list_display = (
        'paypal',
        'phone',
        'like',
        'repost',
        'views',
    )
    list_filter = (
        'paypal',
        'phone',       
            )
    search_fields = (
        'paypal',
        'phone',
    )

# ya part banner ka hai 
@admin.register(Banner)
class adminBanner (admin.ModelAdmin):
    list_display = [
        'title',
    ]

@admin.register(Repost)
class AdminRespost (admin.ModelAdmin):
    list_display = [
        'id'
    ]
@admin.register(Comment)
class AdminComment(admin.ModelAdmin):
    list_display = [
        'id',
        'message'
    ]

admin.site.register(HiddenPost)
admin.site.register(FeedBack)
admin.site.register(Artical)
admin.site.register(ArticalAdvertisement)
admin.site.register(Conversation)
admin.site.register(Support)
admin.site.register(Chat)
admin.site.register(Suggestion)
admin.site.register(Converstion_group)
admin.site.register(Group_Chat)
admin.site.register(Evaluation)
admin.site.register(Annoucement)
admin.site.register(Report_roll)
admin.site.register(Post_limit)
admin.site.register(Subscription)
admin.site.register(Notification)