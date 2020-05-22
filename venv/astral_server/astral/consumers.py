# chat/consumers.py
import json, random, string
from channels.generic.websocket import AsyncWebsocketConsumer

# private
rooms = {}
# sent to client
rooms_info = {}

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        # self.room_hash = ''
        # if rooms[self.room_name]['room_password']:
        #     self.room_hash = self.scope['url_route']['kwargs']['room_hash']

        self.room_group_name = 'chat_%s' % self.room_name
        # if the room exists and hash matches
        if rooms_info[self.room_name]:
        # and rooms[self.room_name]['room_hash'] == self.room_hash :
            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
            # add to capacity count
            rooms_info[self.room_name]['roomCapacity'] += 1
            # update lobby lists capacities 
            await self.channel_layer.group_send(
                'lobby',
                {
                    'type': 'lobby_update',
                    'rooms_info': rooms_info,
                }
            )
                
        #error handle by frontend
            

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        # subtract from capacity count
        rooms_info[self.room_name]['roomCapacity'] -= 1
        #if room becomes empty delete
        if rooms_info[self.room_name]['roomCapacity'] == 0 :
            rooms.pop(self.room_name)
            rooms_info.pop(self.room_name)
        # update lobby lists capacities 
        await self.channel_layer.group_send(
            'lobby',
            {
                'type': 'lobby_update',
                'rooms_info': rooms_info,
            }
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

    # Receive message from chat group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

     # Receive message from lobby group
    async def lobby_update(self, event):
        updated_rooms = event['rooms_info']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'rooms': updated_rooms,
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

        await self.send(text_data=json.dumps({
            'rooms': rooms_info
        }))

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
        #if client requests to join a room
        if request_type == 'join':
            room_name = text_data_json['roomName']
            room_capacity = rooms_info[room_name]['roomCapacity']
            #if there's room to join
            if room_capacity < 8:
                #if room has a password
                if rooms[room_name]['room_password']:
                    #send password request message to client
                    await self.send(text_data=json.dumps({
                        'roomName': room_name,
                        'request': 'password required',
                    }))
                #if room is public
                else:
                    #allow access to client
                    await self.send(text_data=json.dumps({
                        'roomName': room_name,
                    })) 
            #if room is full
            else: 
                #send error to client
                await self.send(text_data=json.dumps({
                    'error': 'full capacity'
                })) 

        #if client submits a private room password
        if request_type == 'password':
            room_name = text_data_json['roomName']
            room_password = text_data_json['roomPassword']
            #if the password matches, return secret hash
            if rooms[room_name]['room_password'] == room_password:
                await self.send(text_data=json.dumps({
                    'roomName': room_name,
                    'roomHash': rooms[room_name]['room_hash'],
                }))
            #if the password doesnt match, return error 
            else:
                await self.send(text_data=json.dumps({
                    'error': 'invalid password'
                }))

        #if client requests to start a room
        elif request_type == 'start':
            room_name = text_data_json['roomName']
            room_password = text_data_json['roomPassword']
            #if room name not taken; prevent lobby group name being taken
            if room_name and room_name not in rooms and room_name != 'lobby':
                room_hash = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
                #add room to rooms list            
                rooms.update({
                    room_name : {
                        'room_password': room_password,
                        'room_hash': room_hash if room_password else '',
                    }
                })
                #add room info to rooms info list
                rooms_info.update({
                    room_name : {
                        'roomName': room_name,
                        'roomAccess': 'private' if room_password else 'public',
                        'roomCapacity': 0,
                    }
                })
                # Send room name to creator (pushes them into room)
                await self.send(text_data=json.dumps({
                    'roomName': room_name,
                    'roomHash': room_hash if room_password else '',
                    'roomPassword': room_password
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