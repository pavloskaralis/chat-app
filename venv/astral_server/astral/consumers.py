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
        self.url_hash = self.scope['url_route']['kwargs']['room_hash'] 
        self.room_group_name = 'chat_' + self.url_hash + '_' + self.room_name

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        
        # if room not found send error to client
        if self.room_name not in rooms :
            await self.send(text_data=json.dumps({
                'error': 'Room does not exist.'
            }))
        # if invalid credentials send error to client
        if rooms[self.room_name]['room_hash'] != self.url_hash :
            await self.send(text_data=json.dumps({
                'error': 'invalid authentication'
            }))
        if rooms_info[self.room_name]['roomCapacity'] >= 8 :
            await self.send(text_data=json.dumps({
                'error': 'room capacity reached'
            }))
        #assign display name
        display_index = rooms_info[self.room_name]['roomCapacity']
        #prevent refresh kick
        # if len(rooms[self.room_name]['display_names']) <= rooms_info[self.room_name]['roomCapacity']:
        #     rooms[self.room_name]['display_names'].append('unknown')
        display_name = rooms[self.room_name]['display_names'][display_index]

        self.display_name = display_name
        # # add to capacity count
        rooms_info[self.room_name]['roomCapacity'] += 1  
        # send display and room name to new client 
        await self.send(text_data=json.dumps({
            'roomHistory': rooms[self.room_name]['room_history'],
            'displayName': display_name,
        }))
        # update room with display names
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'display_names',
                'display_names': rooms[self.room_name]['display_names'],
            }
        )
        # update lobby lists capacities 
        await self.channel_layer.group_send(
            'lobby',
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
        # remove display name
        rooms[self.room_name]['display_names'].remove(self.display_name)
        # subtract from capacity count
        rooms_info[self.room_name]['roomCapacity'] -= 1
        # update room with display names
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'display_names',
                'display_names': rooms[self.room_name]['display_names'],
            }
        )
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

        rooms[self.room_name]['room_history'].append({'message':message, 'displayName':self.display_name})

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'display_name': self.display_name,
            }
        )

    # Receive message from chat group
    async def chat_message(self, event):
        message = event['message']
        display_name = event['display_name']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'displayName': display_name,
        }))
        #update room history 
    # Receive updated display names
    async def display_names(self, event):
        display_names = event['display_names']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'displayNames': display_names,
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
                    #send password and display request
                    await self.send(text_data=json.dumps({
                        'roomName': room_name,
                        'request': 'private',
                    }))
                #if room is public
                else:
                    #send display request
                    await self.send(text_data=json.dumps({
                        'roomName': room_name,
                        'request': 'public',
                    }))
            #if room is full
            else: 
                #send error to client
                await self.send(text_data=json.dumps({
                    'error': 'full capacity'
                })) 

        #if client submits private room request
        if request_type == 'private':
            room_name = text_data_json['roomName']
            room_password = text_data_json['roomPassword']
            display_name = text_data_json['displayName']
            #if the password matches and display not taken return secret hash
            if rooms[room_name]['room_password'] == room_password and display_name and display_name not in rooms[room_name]['display_names']:
                rooms[room_name]['display_names'].append(display_name)
                await self.send(text_data=json.dumps({
                    'roomName': room_name,
                    'roomHash': rooms[room_name]['room_hash'],
                }))
            #if the password doesnt match, return error 
            elif rooms[room_name]['room_password'] != room_password :
                await self.send(text_data=json.dumps({
                    'error': 'invalid password'
                }))
            #if no display name entered issue error
            elif not(display_name):
                await self.send(text_data=json.dumps({
                    'error': 'display name required',
                }))
            #if display name taken issue error
            elif display_name in rooms[room_name]['display_names']:
                await self.send(text_data=json.dumps({
                    'error': 'display name taken',
                }))
            

        #if client submits public room request
        if request_type == 'public':
            room_name = text_data_json['roomName']
            display_name = text_data_json['displayName']
            #if display name not taken allow access
            if display_name and display_name not in rooms[room_name]['display_names']:
                rooms[room_name]['display_names'].append(display_name)
                await self.send(text_data=json.dumps({
                    'roomName': room_name,
                    'roomHash': rooms[room_name]['room_hash'],
                }))
            #if no display name entered issue error
            elif not(display_name):
                await self.send(text_data=json.dumps({
                    'error': 'display name required',
                }))
            #if display name taken issue error
            elif display_name in rooms[room_name]['display_names']:
                await self.send(text_data=json.dumps({
                    'error': 'display name taken',
                }))

        #if client requests to start a room
        elif request_type == 'start':
            room_name = text_data_json['roomName']
            room_password = text_data_json['roomPassword']
            display_name = text_data_json['displayName']
            #if room name not taken; prevent lobby group name being taken
            if room_name and display_name and room_name not in rooms:
                room_hash = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
                #add room to rooms list            
                rooms.update({
                    room_name : {
                        'room_password': room_password,
                        'room_hash': room_hash if room_password else 'public',
                        'display_names': [display_name],
                        'room_history': [],
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
                    'roomHash': room_hash if room_password else 'public',
                    'roomPassword': room_password
                }))
            #if conditions not met
            else:
                # Send error message to room creator
                #handled by frontend
                if not(room_name):
                    await self.send(text_data=json.dumps({
                        'error': 'must enter a room name'
                    }))
                #handled by frontend
                elif not(display_name):
                    await self.send(text_data=json.dumps({
                        'error': 'must enter a display name'
                    }))
                elif room_name:
                    await self.send(text_data=json.dumps({
                        'error': 'Room name has been taken.'
                    }))

    # Receive message from room group
    async def lobby_update(self, event):
        updated_rooms = event['rooms_info']

        # Send message to WebSocket 
        await self.send(text_data=json.dumps({
            'rooms': updated_rooms,
        }))