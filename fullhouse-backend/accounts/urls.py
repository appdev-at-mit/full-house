from django.urls import path
from accounts.views import login_user, test_tiny, member_signup, MemberProfileView

urlpatterns = [
    path('api/login_user/', login_user, name='login_user'),
    path('api/auth/', MemberProfileView.as_view(), name='member_profile'),
    path('api/member_signup/', member_signup, name='member_signup'),
    path('api/test_tiny/', test_tiny, name='test_tiny'),
]
