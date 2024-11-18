import datetime
import json
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from rest_framework import generics
from rest_framework.parsers import JSONParser
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import User, Member
from .serializers import UserSerializer, MemberSerializer, TinySerializer
from django.views.decorators.csrf import csrf_exempt
from .forms import MemberForm
from .models import Member

@csrf_exempt
@api_view(['GET', 'POST'])
def member_signup(request):
    if request.method == 'GET':
        form = MemberForm()
        return render(request, 'member_signup.html', {'form': form})

    elif request.method == 'POST':
        form = MemberForm(request.POST)
        if form.is_valid():
            new_member = form.save(commit=False)
            new_member.user = request.user  # Assuming the user is logged in
            new_member.account_creation_date = datetime.date.today()  # Set creation date
            new_member.save()
            return JsonResponse({'message': 'Member profile created successfully'}, status=201)
        return JsonResponse(form.errors, status=400)

def login_user(request):
    return render(request, "login.html", {})

class MemberProfileView(APIView):
    """
    Gets and posts user information for the profile page.
    GET: requires a username attribute in the query parameters
    POST: requires a JSON of information to store
    """
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
  

    def get_member(func):
        """
        Decorator to return a member and the original request associated with it.
        """
        def api_func(self, request, format=None):
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
            return func(self, request, out_member)

        return api_func

    def save_user(self, serializer):
        """
        Helper to save to database if it is valid.
        """
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

    @get_member
    def get(self, request, member):
        serializer = MemberSerializer(member)
        return JsonResponse(serializer.data, safe=False)

    def post(self, request, format=None):
        user_data = JSONParser().parse(request)
        serializer = MemberSerializer(data=user_data)
        return self.save_user(serializer)

    @get_member
    def delete(self, request, member):
        member.delete()
        return JsonResponse(status=204)

    @get_member
    def put(self, request, member):
        user_data = JSONParser().parse(request)
        serializer = MemberSerializer(member, data=user_data)
        return self.save_user(serializer)

    def dump(self, request, format=None):
        """
        Returns all relevant users as a JSON. If the request `only_active`
        field is set to False, it will return all users that are either
        actively looking for a roommate or have turned off location privacy.
        Users that have turned on location privacy and are inactive will
        never be accessed by the frontend.
        """
        def exclude_inactive():
            return {'rooming_status': Member.Status.INACTIVE}
        def exclude_private():
            return {'private_location': True}

        request_data = JSONParser().parse(request)
        only_active = request_data.get('only_active', True)
        filter = exclude_inactive() if only_active else exclude_private()

        # get members not satisfying the filter
        all_users = list(Member.objects.exclude(**filter)) 
        
        # serialize and return
        serialized = json.dumps(all_users, cls=DjangoJSONEncoder)
        return JsonResponse(serialized, safe=False)


def test_tiny(request):
    """
    Test request to validate TinySerializer data.
    Only accepts POST requests.
    """
    if request.method == "POST":
        tiny_data = JSONParser().parse(request)
        serializer = TinySerializer(data=tiny_data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    else:
        return JsonResponse({"error": "GET method not allowed for this endpoint"}, status=405)
