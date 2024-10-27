from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.core import serializers
from rest_framework import generics
from rest_framework.parsers import JSONParser
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from . import models
from .models import User, Member
from .serializers import UserSerializer, MemberSerializer, TinySerializer

# Create your views here.

def login_user(request):
    return render(request, "login.html", {})

class MemberProfileView(APIView):
    """
    Gets and posts user information for the profile page.
    GET: requires a username attribute
    POST: requires a JSON of information to store
    """
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        request_data = JSONParser().parse(request)
        out_user = User.objects.get(username=request_data.username)
        out_member = Member.objects.get(user=out_user)
        return JsonResponse(serializers.serialize("json", out_member))

    def post(self, request, format=None):
        user_data = JSONParser().parse(request)
        serializer = MemberSerializer(data=user_data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


def test_tiny(request):
    """
    test request
    """
    if request.method == "GET":
        tiny_data = JSONParser().parse(request)
        serializer = TinySerializer(data=tiny_data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

