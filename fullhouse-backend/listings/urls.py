# listings/urls.py
from rest_framework.routers import DefaultRouter
from .views import ProspectiveListingViewSet

router = DefaultRouter()
router.register(r'listings', ProspectiveListingViewSet, basename='prospective-listing')

urlpatterns = router.urls
