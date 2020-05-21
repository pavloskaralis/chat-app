# chat/urls.py
from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<str:room_hash>/<str:room_name>/', views.room, name='private_room'),
    path('<str:room_name>/', views.room, name='room'),
]