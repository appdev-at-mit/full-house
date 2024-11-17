from django.urls import path
from accounts.views import login_user, test_tiny, member_signup
from accounts import views

urlpatterns = [
    path('api/login_user', login_user, name='login_user'),
    path('api/auth/', views.MemberProfileView.as_view()),
    path('api/member_signup/', member_signup, name='member_signup'),
]
