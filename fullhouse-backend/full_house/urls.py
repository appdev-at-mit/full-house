from django.contrib import admin
from django.urls import include, path
from routers import router
from accounts.views import login_user, member_signup, MemberProfileView, member_dump
from listings.views import delete_listing
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("accounts.urls")),
    path("api/", include((router.urls, "core_api"), namespace="core_api")),
    path("auth/", include("django.contrib.auth.urls")),
    path("api/login_user/", login_user, name="login_user"),
    path("api/member_signup/", member_signup, name="member_signup"),
    path("api/member_profile/", MemberProfileView.as_view(), name="member_profile"),
    path('api/member_profiles/', member_dump, name='member_dump'),
    path('api/delete_listing/<int:listing_id>/', delete_listing, name='delete_listing'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
