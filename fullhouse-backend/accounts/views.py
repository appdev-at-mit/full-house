import datetime
import json
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


@csrf_exempt
def member_signup(request):
    if request.method == "GET":
        form = MemberForm()
        form_fields = []

        for field in form:
            # Determine the input type by inspecting the widget type
            widget = field.field.widget
            input_type = "text"  # Default to text if no specific input type
            if hasattr(widget, 'input_type'):
                input_type = widget.input_type
            elif isinstance(widget, forms.Textarea):
                input_type = "textarea"
            elif isinstance(widget, forms.CheckboxInput):
                input_type = "checkbox"
            elif isinstance(widget, forms.DateInput):
                input_type = "date"
            elif isinstance(widget, forms.Select):
                input_type = "select"
            
            form_fields.append({
                "name": field.name,
                "label": field.label,
                "type": input_type,
            })
        
        return JsonResponse({"form_fields": form_fields}, status=200)

    elif request.method == "POST":
        form = MemberForm(request.POST)
        if form.is_valid():
            new_member = form.save(commit=False)
            if request.user.is_authenticated:
                new_member.user = request.user
            else:
                return JsonResponse({"error": "User must be logged in to sign up"}, status=403)
            new_member.account_creation_date = datetime.date.today()
            new_member.save()
            return JsonResponse({"message": "Member profile created successfully"}, status=201)
        return JsonResponse(form.errors, status=400)



def login_user(request):
    return render(request, "login.html", {})


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
