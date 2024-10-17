from rest_framework import routers

from accounts.viewsets import AccountsViewSet

router = routers.SimpleRouter()

router.register(r"accounts", AccountsViewSet, basename="accounts")

urlpatterns = router.urls
