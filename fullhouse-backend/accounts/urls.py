from django.urls import path
from accounts.views import login_user, user_profile, test_tiny
from accounts import views

urlpatterns = [
    path('api/login_user', login_user, name='login_user'),
    path('api/auth/', views.MemberProfileView.as_view()),
    path('api/test_tiny', test_tiny, name='test_tiny'),
]
