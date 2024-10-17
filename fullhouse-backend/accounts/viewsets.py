from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from accounts.models import Member

from accounts.serializers import MemberSerializer

class AccountsViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [AllowAny]
