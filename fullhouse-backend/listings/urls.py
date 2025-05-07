from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProspectiveListingViewSet, delete_listing

router = DefaultRouter()
router.register(r'listings', ProspectiveListingViewSet, basename='listing')

urlpatterns = [
    path('', include(router.urls)),
    path('api/delete_listing/<int:listing_id>/', delete_listing, name='delete_listing'),
]
