from rest_framework.views import APIView
from django.http import JsonResponse
from django.db import models
from rest_framework.decorators import api_view
from messaging.models import Message
from accounts.models import User
from accounts.serializers import UserSerializer
from messaging.serializer import MessageSerializer

# API to get the entire chat history with one person
@api_view(['GET'])
def get_chat_history(request):
    recipient_id = request.query_params.get('recipient_id')
    if not recipient_id:
        return JsonResponse({"error": "recipient_id is required"}, status=400)
    
    try:
        recipient = User.objects.get(_id=recipient_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    # Fetch all messages between the current user and the recipient
    user = request.user  # Assuming the user is authenticated
    messages = Message.objects.filter(
        (models.Q(sender=user) & models.Q(recipient=recipient)) |
        (models.Q(sender=recipient) & models.Q(recipient=user))
    ).order_by('timestamp')
    
    serializer = MessageSerializer(messages, many=True)
    return JsonResponse(serializer.data)


# API to send a message
@api_view(['POST'])
def send_message(request):
    content = request.data.get('content')
    recipient_id = request.data.get('recipient_id')

    if not content or not recipient_id:
        return JsonResponse({"error": "content and recipient_id are required"}, status=400)

    try:
        recipient = User.objects.get(_id=recipient_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "Recipient not found"}, status=404)

    sender = request.user  # Assuming the user is authenticated

    message = Message.objects.create(
        sender=sender,
        recipient=recipient,
        content=content
    )
    serializer = MessageSerializer(message)
    return JsonResponse(serializer.data)


# API to get users with whom had a chat before
@api_view(['GET'])
def get_active_users(request):
    user = request.user  # Assuming the user is authenticated

    # Get users with whom the authenticated user has exchanged messages (either sent or received)
    users_with_chats = User.objects.filter(
        models.Q(sent_messages__sender=user) | models.Q(received_messages__recipient=user)
    ).distinct()

    # Serialize the list of users
    serializer = UserSerializer(users_with_chats, many=True)

    return JsonResponse(serializer.data)


# API to initialize the socket for a user (store socket ID)
@api_view(['POST'])
def init_socket(request):
    socketid = request.data.get('socketid')
    if not socketid:
        return JsonResponse({"error": "socketid is required"}, status=400)

    user = request.user  # Assuming the user is authenticated
    # For this example, we are not storing the socket ID in the database,
    # but you could store it in a separate table if needed for socket communication.
    
    # Emit an event for active users (typically handled in real-time systems like with Django Channels)
    # Emit new activeUsers socket event to all connected users
    # (This requires an implementation with Django Channels or similar real-time backend)

    return JsonResponse({})

