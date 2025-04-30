from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.core.serializers import serialize
import json
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import ProspectiveListing
from .forms import ProspectiveListingForm
from accounts.models import Member
from .serializers import ProspectiveListingSerializer

@csrf_exempt
def create_listing(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        form = ProspectiveListingForm(data)
        if form.is_valid():
            listing = form.save()
            return JsonResponse({'message': 'Listing created successfully', 'id': listing.id})
        else:
            return JsonResponse({'errors': form.errors}, status=400)
    return HttpResponseBadRequest('Only POST requests are allowed.')

@csrf_exempt
def delete_listing(request, listing_id):
    if request.method == 'DELETE':
        listing = get_object_or_404(ProspectiveListing, id=listing_id)
        listing.delete()
        return JsonResponse({'message': 'Listing deleted successfully'})
    return HttpResponseBadRequest('Only DELETE requests are allowed.')

def get_all_listings(request):
    listings = ProspectiveListing.objects.all()
    listings_data = [
        {
            'id': listing.id,
            'start_date': listing.start_date,
            'end_date': listing.end_date,
            'address': listing.address,
            'housing_image_base64': listing.housing_image_base64,
            'contact_info': listing.contact_info,
            'poster_id': listing.poster.id,
            'num_bedrooms': listing.num_bedrooms,
            'num_bathrooms': listing.num_bathrooms,
            'has_ac': listing.has_ac,
            'has_wifi': listing.has_wifi,
            'pets_allowed': listing.pets_allowed,
            'num_roommates_needed': listing.num_roommates_needed,
            'rent': str(listing.rent)
        }
        for listing in listings
    ]
    return JsonResponse({'listings': listings_data})

class ProspectiveListingViewSet(viewsets.ModelViewSet):
    queryset = ProspectiveListing.objects.all()
    serializer_class = ProspectiveListingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'form_fields']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        member = Member.objects.get(user=self.request.user)
        serializer.save(poster=member)

    @action(detail=False, methods=['get'])
    def form_fields(self, request):
        """Returns the form fields needed for creating a listing"""
        fields = {
            'start_date': {'type': 'date', 'required': True},
            'end_date': {'type': 'date', 'required': True},
            'address': {'type': 'text', 'required': True},
            'housing_image_base64': {'type': 'text', 'required': False},
            'contact_info': {'type': 'text', 'required': True},
            'num_bedrooms': {'type': 'number', 'required': True},
            'num_bathrooms': {'type': 'number', 'required': True},
            'has_ac': {'type': 'checkbox', 'required': False},
            'has_wifi': {'type': 'checkbox', 'required': False},
            'pets_allowed': {'type': 'checkbox', 'required': False},
            'num_roommates_needed': {'type': 'number', 'required': True},
            'rent': {'type': 'number', 'required': True},
        }
        return Response(fields)
