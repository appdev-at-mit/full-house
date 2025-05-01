from django.urls import path
from accounts.views import login_user, member_signup, MemberProfileView, member_dump

urlpatterns = [
    path('api/login_user/', login_user, name='login_user'),
    path('api/auth/', MemberProfileView.as_view(), name='member_profile'),
    path('api/member_signup/', member_signup, name='member_signup'),
    path('api/member_profiles/', member_dump, name='member_dump'),
    # path('api/test_tiny/', test_tiny, name='test_tiny'),
]
