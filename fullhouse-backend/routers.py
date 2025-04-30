from rest_framework import routers

from accounts.viewsets import AccountsViewSet
from listings.views import ProspectiveListingViewSet

router = routers.SimpleRouter()

router.register(r"accounts", AccountsViewSet, basename="accounts")
router.register(r"listings", ProspectiveListingViewSet, basename="listing")

urlpatterns = router.urls
