from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages

from rest_framework import generics
from rest_framework.parsers import JSONParser
from . import models
from .models import User, Member
from .serializers import UserSerializer, MemberSerializer, TinySerializer

# Create your views here.

def login_user(request):
    return render(request, "login.html", {})

def user_profile(request):
    """
    Gets and posts user information for the profile page.
    GET: requires a username attribute
    POST: requires a JSON file
    """
    if request.method == "GET":
        # we need a request.username attribute to get out the user
        raise NotImplementedError
    elif request.method == "POST":
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

