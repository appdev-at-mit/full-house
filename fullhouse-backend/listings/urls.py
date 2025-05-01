from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProspectiveListingViewSet

router = DefaultRouter()
router.register(r'listings', ProspectiveListingViewSet, basename='listing')

urlpatterns = [
    path('', include(router.urls)),
]
