from django.urls import path
from accounts.views import login_user, user_profile, test_tiny

urlpatterns = [
    path('api/login_user', login_user, name='login_user'),
    path('api/user_profile', user_profile, name='user_profile'),
    path('api/test_tiny', test_tiny, name='test_tiny'),
]