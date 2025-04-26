# listings/views.py
from rest_framework import viewsets
from .models import ProspectiveListing
from .serializer import ProspectiveListingSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class ProspectiveListingViewSet(viewsets.ModelViewSet):
    queryset = ProspectiveListing.objects.all()
    serializer_class = ProspectiveListingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


    # listings/views.py
# from rest_framework import permissions

# class IsPosterOrReadOnly(permissions.BasePermission):
#     def has_object_permission(self, request, view, obj):
#         if request.method in permissions.SAFE_METHODS:
#             return True
#         return obj.poster == request.user.member  # Assuming Member is linked to User via OneToOne

# class ProspectiveListingViewSet(viewsets.ModelViewSet):
#     queryset = ProspectiveListing.objects.all()
#     serializer_class = ProspectiveListingSerializer
#     permission_classes = [IsPosterOrReadOnly, IsAuthenticatedOrReadOnly]

#     def perform_create(self, serializer):
#         serializer.save(poster=self.request.user.member)

