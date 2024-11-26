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
from .serializers import UserSerializer, MemberSerializer
from django.views.decorators.csrf import csrf_exempt
from .forms import MemberForm
from django import forms
from rest_framework.authtoken.models import Token


@csrf_exempt
def member_signup(request):
    if request.method == "GET":
        form = MemberForm()
        form_fields = []

        for field in form:
            widget = field.field.widget
            input_type = "text"
            options = None

            if hasattr(widget, 'input_type'):
                input_type = widget.input_type
                if input_type == 'select':
                    options = [{"value": choice[0], "label": choice[1]} for choice in field.field.choices]
            elif isinstance(widget, forms.Textarea):
                input_type = "textarea"
            elif isinstance(widget, forms.CheckboxInput):
                input_type = "checkbox"
            elif isinstance(widget, forms.DateInput):
                input_type = "date"

            print(field.field.widget)

            form_fields.append({
                "name": field.name,
                "label": field.label,
                "type": input_type,
                "options": options,
            })

        return JsonResponse({"form_fields": form_fields}, status=200)

    elif request.method == "POST":
        form = MemberForm(request.POST)
        if form.is_valid():
            print("VALID")
            new_user = User(username=form.data['username'], 
                            first_name=form.data['first_name'],
                            last_name = form.data['last_name'],
                            email = form.data['email'])
            new_user.set_password(form.data['password'])
            new_member = form.save(commit=False)
            # new_member.user = request.user
            new_member.user = new_user
            new_member.account_creation_date = datetime.date.today()
            new_member.user.save()
            new_member.save()
            return JsonResponse({"message": "Member profile created successfully"}, status=201)
        return JsonResponse(form.errors, status=400)



from django.contrib.auth.tokens import default_token_generator

@csrf_exempt
def login_user(request):
    if request.method == "POST":
        try:
            data = JSONParser().parse(request)
            username = data.get("username")
            password = data.get("password")

            if not username or not password:
                return JsonResponse({"message": "Username and password are required"}, status=400)

            # Authenticate user
            user = authenticate(request, username=username, password=password)
            print(user)

            if user is not None:
                # Login user
                login(request, user)

                # Generate authentication token (or use a library like JWT)
                auth_key = default_token_generator.make_token(user)

                # Return user data and authKey
                return JsonResponse({
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                    },
                    "authKey": auth_key,
                }, status=200)

            return JsonResponse({"message": "Invalid username or password"}, status=401)
        except Exception as e:
            return JsonResponse({"message": "An error occurred: " + str(e)}, status=500)

    return JsonResponse({"error": "GET method not allowed for this endpoint"}, status=405)


def get_member(func):
    def api_func(self, request, *args, **kwargs):
        username = request.query_params.get("username")
        if not username:
            return JsonResponse({"error": "Username is required"}, status=400)
        try:
            out_user = User.objects.get(username=username)
            out_member = Member.objects.get(user=out_user)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        except Member.DoesNotExist:
            return JsonResponse({"error": "Member profile not found"}, status=404)
        return func(self, request, out_member, *args, **kwargs)

    return api_func


class MemberProfileView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    @get_member
    def get(self, request, member):
        serializer = MemberSerializer(member)
        return JsonResponse(serializer.data, safe=False)

    def post(self, request, format=None):
        user_data = JSONParser().parse(request)
        serializer = MemberSerializer(data=user_data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

    @get_member
    def delete(self, request, member):
        member.delete()
        return JsonResponse({"message": "Deleted successfully"}, status=204)

    @get_member
    def put(self, request, member):
        user_data = JSONParser().parse(request)
        serializer = MemberSerializer(member, data=user_data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=200)
        return JsonResponse(serializer.errors, status=400)

    def dump(self, request, format=None):
        request_data = JSONParser().parse(request)
        only_active = request_data.get("only_active", True)

        filter_criteria = {"rooming_status": Member.Status.INACTIVE} if only_active else {"private_location": True}
        all_users = Member.objects.exclude(**filter_criteria)

        serialized = serializers.serialize("json", all_users)
        return JsonResponse({"users": json.loads(serialized)}, safe=False)


@csrf_exempt
def test_tiny(request):
    if request.method == "POST":
        tiny_data = JSONParser().parse(request)
        serializer = TinySerializer(data=tiny_data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    return JsonResponse({"error": "GET method not allowed for this endpoint"}, status=405)
