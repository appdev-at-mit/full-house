from django.urls import path
from messaging.views import get_chat_history, send_message, get_active_users, init_socket

urlpatterns = [
    path('api/chat/', get_chat_history, name='get_chat_history'),
    path('api/message/', send_message, name='send_message'),
    path('api/activeUsers/', get_active_users, name='get_active_users'),
    path('api/initsocket/', init_socket, name='init_socket'),
]

