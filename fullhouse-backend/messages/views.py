import datetime
import json
import re
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from rest_framework.parsers import JSONParser
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import User, Member
# from .serializers import UserSerializer, MemberSerializer
from django.views.decorators.csrf import csrf_exempt
# from .forms import MemberForm
from django import forms
from rest_framework.authtoken.models import Token

@csrf_exempt
def send_message(request):
    if request.method == "GET":
        return
    return

def get_message(request):
    if request.method == "GET":
        return
    return

def message_history(request):
    if request.method == "GET":
        return
    return
