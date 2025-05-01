from django.db import models
import datetime
import typing
from django.contrib.auth.models import User

# Message Model
class Message(models.Model):
    '''
    A message sent by a Full House user.
    '''
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    timestamp = models.DateTimeField(auto_now_add=True)
    content = models.TextField()

    def __str__(self):
        return f"Message from {self.sender.name} to {self.recipient.name}: {self.content[:50]}"


# Chat Model
class ChatData(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_chats')
    messages = models.ManyToManyField(Message, related_name='chats')

    def __str__(self):
        return f"Chat with {self.recipient.username}"
