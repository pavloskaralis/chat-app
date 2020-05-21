# chat/consumers.py
import json, random, string
from channels.generic.websocket import AsyncWebsocketConsumer

# private
rooms = []
# easy way to check names
room_names = []
# sent to client
rooms_info = []

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
#///////////////////////
#///////////////////////
#///////////////////////
#///////////////////////
#lobby consumer
class LobbyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'lobby'
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'lobby_update',
                'rooms_info': rooms_info,
            }
        )

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        request_type = text_data_json['requestType']
        room_name = text_data_json['roomName']
        room_password = text_data_json['roomPassword']

        if request_type == 'join':
            pass
        elif request_type == 'start':
            #if room name not taken; prevent lobby group name being taken
            if room_name and room_name not in room_names and room_name != 'lobby':
                room_hash = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
                #add room to rooms list            
                rooms.append({
                    'room_name':room_name,
                    'room_password': room_password,
                    'room_hash': room_hash,
                })
                #add room name to room names list
                room_names.append(room_name)
                #add room info to rooms info list
                rooms_info.append({
                    'roomName': room_name,
                    'access': 'private' if room_password else 'public',
                })
                # Send room names to lobby group
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'lobby_update',
                        'rooms_info': rooms_info,
                    }
                )
                # Send room name to creator (pushes them into room)
                await self.send(text_data=json.dumps({
                    'roomName': room_name,
                    'roomPassword': room_password,
                }))
            #if conditions not met
            else:
                # Send error message to room creator
                if room_name == 'lobby':
                    await self.send(text_data=json.dumps({
                        'error': 'room name not allowed'
                    }))
                elif room_name and room_name != 'lobby':
                    await self.send(text_data=json.dumps({
                        'error': 'room name taken'
                    }))
                else:
                    await self.send(text_data=json.dumps({
                        'error': 'must enter a room name'
                    }))

    # Receive message from room group
    async def lobby_update(self, event):
        updated_rooms = event['rooms_info']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'rooms': updated_rooms
        }))