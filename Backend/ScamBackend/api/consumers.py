import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from asgiref.sync  import async_to_sync
from  channels.layers import get_channel_layer
from django.contrib.auth.models import User

# ya room ka name hai taky koi spelling ki galti na ho 
def home_room():
    return 'home_feed'

def notification_room(user_id):
    return f'user_id_{user_id}'

def chat_room(conversation_id):
    return f'conversation_{conversation_id}'
 
def group_room(group_id):
    return f'group_{group_id}'



# ya funciton ya view sa connnet ho ga data lany or lay jany ma kam aye ga
def Broadcast(group_name,event_type,data):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            'type':event_type,
            'message':data
        }
    )

# ya class har kisy ka leay use ho gi ku ka extra code sirf is ma likh deya hai is leya
class SimpleConsumer (AsyncJsonWebsocketConsumer):
    room_name = None
    # ya function user ko room ma add karta hi
    async def connect(self):
        # agar room nahi hai to wapis 
        if not self.room_name:
            await self.close()
            return
        
        await self.channel_layer.group_add(
            self.room_name,self.channel_name
        )
        # ya connect ko accept kart ahi 
        await self.accept()

    # ya funciton user ko room sa remove karta hia agar wo page ko close karta hia to
    async def disconnect(self, close_code):
        if self.room_name:
          await self.channel_layer.group_discard(
                      self.room_name,self.channel_name
                 )
        
    # ya fuction data send karny ka kam karta hai 
    async def send_live_data(self,event):
        await self.send_json(event['message'])


# ya function notification ka hai hai 
class NotificationConsumer(SimpleConsumer):
    async def connect(self):
        user_id = self.scope['url_route']['kwargs'].get('user_id')
        self.room_name = notification_room(user_id)
        await super().connect()

# ya function blacklist ka hai  ka hai hai 
class ConversationConsumer(SimpleConsumer):
    async def connect(self):
        conversation_id = self.scope['url_route']['kwargs'].get('conversation_id')
        self.room_name = chat_room(conversation_id)
        await super().connect()

# ya function group chat ha hai hai 
class GroupConsumer(SimpleConsumer):
    async def connect(self):
        group_id = self.scope['url_route']['kwargs'].get('group_id')
        self.room_name = group_room(group_id)
        await super().connect()


# ya function home feed  ka hai hai 
class HomeFeedConsumer(SimpleConsumer):
    async def connect(self):
        self.room_name = home_room()
        await super().connect()
 