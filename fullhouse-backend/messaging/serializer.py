from rest_framework import serializers
from messaging.models import Message
from accounts.serializers import UserSerializer

# Serializer for MessageObj
class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer()
    recipient = UserSerializer()

    class Meta:
        model = Message
        fields = ['sender', 'recipient', 'timestamp', 'content']
