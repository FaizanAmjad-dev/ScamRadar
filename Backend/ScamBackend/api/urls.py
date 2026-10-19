from .views import  *
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView , TokenRefreshSlidingView

urlpatterns = [
    # special home page post and repost api
    path('feed/', HomeFeedData.as_view() , name='HomeFeedData'),

    # ya post ka url hai 
    path('post/', LCPost.as_view() , name='LCPost'),
    # ya post ko delete karny ka leya hai 
    path('post/<int:pk>/', DURPost.as_view() , name='DURPost'),

    # ya part repost ka hai 
    path('repost/', LCPRepost.as_view() , name='LCRepost'),
    # ya Repost ko delete karny ka leya hai 
    path('repost/<int:pk>/', DURRepost.as_view() , name='DURRepost'),

   # ya part view ka hai 
    path('like/', LCPLike.as_view() , name='LCPLike'),
    # ya view ko delete karny ka leya hai 
    path('like/<int:pk>/', DURLike.as_view() , name='DURLike'),

   # ya part view ka hai 
    path('view/', LCPView.as_view() , name='LCPView'),
    # ya view ko delete karny ka leya hai 
    path('view/<int:pk>/', DURView.as_view() , name='DURView'),


    # ya part banner ka hai 
    path('banner/', LCPBanner.as_view() , name='LCPBanner'),
    # ya Banner ko delete karny ka leya hai 
    path('banner/<int:pk>/', DURBanner.as_view() , name='DURBanner'),

    # ya part hidden ka hai 
    path('hidden/', LCPHidden.as_view() , name='LCPHidden'),
    # ya hidden ko delete karny ka leya hai 
    path('hidden/<int:pk>/', DURHidden.as_view() , name='DURHidden'),

    # ya part comment ka hai
    path('comment/', LCPComment.as_view() , name='LCPComment'),
    # ya Comment ko delete karny ka leya hai 
    path('comment/<int:pk>/', DURComment.as_view() , name='DURComment'),

   # ya part specific profile ka hai
    path('SpecificProfile/', SpecificLCPProfile.as_view() , name='SpecificLCPProfile'), 

    # ya part profile ka hai
    path('profile/', LCPProfile.as_view() , name='LCPProfile'),
    # ya profile ko delete karny ka leya hai 
    path('profile/<int:user>/', DURProfile.as_view() , name='DURProfile'),

    # ya part profile ka unbnned kar ny ka ley hai  hai
    path('profileUNbanned/', LCPProfileBanned.as_view() , name='LCPProfileBanned'),



 # ya part Conversation ka hai
    path('Conversation/', LCPConversation.as_view() , name='LCPConversation'),
    # ya Conversation ko delete karny ka leya hai 
    path('Conversation/<int:pk>/', DURConversation.as_view() , name='DURConversation'),

 # ya part Chat ka hai
    path('Chat/', LCPChat.as_view() , name='LCPChat'),
    # ya Chat ko delete karny ka leya hai 
    path('Chat/<int:pk>/', DURChat.as_view() , name='DURChat'),

 # ya part Annoucement ka hai
    path('Annoucement/', LCPAnnoucement.as_view() , name='LCPAnnoucement'),
    # ya Annoucement ko delete karny ka leya hai 
    path('Annoucement/<int:pk>/', DURAnnoucement.as_view() , name='DURAnnoucement'),

 # ya part FeedBack ka hai
    path('feedback/', LCPFeedBack.as_view() , name='LCPFeedBack'),
    # ya profile ko FeedBack karny ka leya hai 
    path('feedback/<int:pk>/', DURFeedBack.as_view() , name='DURFeedBack'),

 # ya part Support ka hai
    path('Support/', LCPSupport.as_view() , name='LCPSupport'),
    # ya Support ko delete karny ka leya hai 
    path('Support/<int:pk>/', DURSupport.as_view() , name='DURSupport'),

# ya part Artical ka hai
    path('Artical/', LCPArtical.as_view() , name='LCPArtical'),
    # ya Artical ko delete karny ka leya hai 
    path('Artical/<int:pk>/', DURArtical.as_view() , name='DURArtical'),

    # ya part Advertisement ka hai
    path('Advertisement/', LCPAdvertisement.as_view() , name='LCPAdvertisement'),

# ya part Suggestion ka hai
    path('Suggestion/', LCPSuggestion.as_view() , name='LCPSuggestion'),
    # ya DURASuggestion ko delete karny ka leya hai 
    path('Suggestion/<int:pk>/', DURSuggestion.as_view() , name='DURASuggestion'),

# ya part User ka hai
    path('user/', LCPUser.as_view() , name='LCPUser'),
    # ya part user ka leya hia 
    path('user/<int:pk>/', DURUser.as_view() , name='DURUser'),

# ya part Conversation ka hai
    path('conversationgroup/', LCPConversationGoup.as_view() , name='LCPConversationGoup'),
    # ya part Conversation ka leya hia 
    path('conversationgroup/<int:pk>/', DURConversationGoup.as_view() , name='DURConversationGoup'),

# ya part groupchat ka hai
    path('groupchat/', LCPGroupChat.as_view() , name='LCPGroupChat'),
    # ya part groupchat ka leya hia 
    path('groupchat/<int:pk>/', DURGroupChat.as_view() , name='DURGroupChat'),

# ya part Evalution ka hai
    path('evalution/', LCPEvalution.as_view() , name='LCPEvalution'),

# ya part Reportroll ka hai
    path('reportroll/', LCPReportroll.as_view() , name='LCPReportroll'),
    # ya Annoucement ko delete karny ka leya hai 
    path('reportroll/<int:pk>/', DURReportroll.as_view() , name='DURReportroll'),

# ya part Subscription ka hai
    path('Subscription/', LCPSubscription.as_view() , name='LCPSubscription'),
    # ya Subscription ko delete karny ka leya hai 
    path('Subscription/<int:pk>/', DURSubscription.as_view() , name='DURSubscription'),

# ya part PostLimit ka hai
    path('Limit/', LCPostLimit.as_view() , name='LCPostLimit'),

# ya part DashBoard ka hai
    path('dashboard/', DashBoard.as_view() , name='DashBoard'),

# ya part Notification ka hai
    path('Notification/', LCNotification.as_view() , name='LCNotification'),
    # ya Notification ko delete karny ka leya hai 
    path('Notification/<int:pk>/', DURNotification.as_view() , name='DURNotification'),


# ya part createUser ka hai
    path('createuser/', LCPCreateUser.as_view() , name='LCPCreateUser'),
    # ya section login karna ka leya hai 
    path('login/access/', LCPToken.as_view() , name='LCPToken'),
    # ya Comment ko delete karny ka leya hai 
    path('login/refresh/', TokenRefreshSlidingView.as_view() , name='TokenRefreshSlidingView'), 

]
