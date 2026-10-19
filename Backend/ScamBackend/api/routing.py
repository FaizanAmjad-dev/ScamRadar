from django.urls import path
from .consumers import (
    HomeFeedConsumer,
    NotificationConsumer,
    ConversationConsumer,
    GroupConsumer,
)
 
websocket_urlpatterns = [
    path('ws/homefeed/', HomeFeedConsumer.as_asgi()),
    path('ws/notification/<int:user_id>/', NotificationConsumer.as_asgi()),
    path('ws/conversation/<int:conversation_id>/', ConversationConsumer.as_asgi()),
    path('ws/group/<int:group_id>/', GroupConsumer.as_asgi()),
]