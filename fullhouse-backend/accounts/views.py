from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages

# Create your views here.

def index(request):
    return HttpResponse("Hello, world.")

def user_information(request):
    return HttpResponse("Wow, this user doesn't have a lot of information. The FBI is gonna work on that.")

def login_user(request):
    return render(request, "login.html", {})
