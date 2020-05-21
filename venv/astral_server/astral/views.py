from django.shortcuts import render

def index(request):
    return render(request, 'astral/index.html')

def room(request, room_name, room_hash):
    return render(request, 'astral/room.html', {
        'room_name': room_name,
        'room_hash': room_hash,
    })