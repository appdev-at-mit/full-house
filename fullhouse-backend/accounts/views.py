import datetime
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from rest_framework.parsers import JSONParser
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import User, Member
from .serializers import MemberSerializer
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
                elif input_type == 'date':
                    options = [{"value": widget.attrs.get("min"), "label": "min"}, {"value": widget.attrs.get("max"), "label": "max"}]
                elif input_type == 'number':
                    options = []
                    if widget.attrs.get("min"):
                        options += [{"value": widget.attrs.get("min"), "label": "min"}]
                    if widget.attrs.get("max"):
                        options += [{"value": widget.attrs.get("max"), "label": "max"}]
            elif isinstance(widget, forms.Textarea):
                input_type = "textarea"
            elif isinstance(widget, forms.CheckboxInput):
                input_type = "checkbox"

            form_fields.append({
                "name": field.name,
                "label": field.label,
                "type": input_type,
                "options": options,
                "required": field.field.required,
            })

        return JsonResponse({"form_fields": form_fields}, status=200)

    elif request.method == "POST":
        form = MemberForm(request.POST)
        if form.is_valid():
            new_user = User(username=form.data['username'], 
                            first_name=form.data['first_name'],
                            last_name = form.data['last_name'],
                            email = form.data['email'])
            new_user.set_password(form.data['password'])
            new_member = form.save(commit=False)
            new_member.user = new_user
            new_member.account_creation_date = datetime.date.today()
            new_member.user.save()
            new_member.save()
            return JsonResponse({"message": "Member profile created successfully"}, status=201)
        return JsonResponse(form.errors, status=400)



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

            if user is not None:
                # Login user
                login(request, user)
                try: 
                    auth_key = Token.objects.get(user=user).key
                except Token.DoesNotExist:
                    auth_key = Token.objects.create(user=user).key

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
        user = request.user
        """
        if not username:
            return JsonResponse({"error": "Username is required"}, status=400)
        """
        try:
            out_member = Member.objects.get(user=user)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        except Member.DoesNotExist:
            return JsonResponse({"error": "Member profile not found"}, status=404)
        return func(self, request, out_member, *args, **kwargs)

    return api_func

@csrf_exempt
def member_dump(request):
    if request.method == "POST":
        request_data = JSONParser().parse(request)
        only_active = request_data.get("only_active", True)

        filter_criteria = {"rooming_status": Member.Status.INACTIVE} if only_active else {"private_location": True}
        all_users = Member.objects.exclude(**filter_criteria)

        serializer = MemberSerializer(all_users, many=True)
        return JsonResponse({"users": serializer.data}, safe=False)

    return JsonResponse({"error": "Only POST supported"}, status=405)


class MemberProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    @get_member
    def get(self, request, member):
        serializer = MemberSerializer(member)
        return JsonResponse(serializer.data, safe=False, status=200)

    def post(self, request, format=None):
        user_data = JSONParser().parse(request)
        serializer = MemberSerializer(data=user_data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

    @get_member
    def delete(self, request, member):
        user = member.user
        member.delete()
        user.delete()
        return JsonResponse({"message": "Deleted successfully"}, status=204)

    @get_member
    def put(self, request, member):
        user_data = JSONParser().parse(request)
        serializer = MemberSerializer(member, data=user_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=200)
        return JsonResponse(serializer.errors, status=400)
