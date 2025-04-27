from rest_framework import serializers
from .models import ProspectiveListing

class ProspectiveListingSerializer(serializers.ModelSerializer):
    posterUsername = serializers.CharField(source='poster.user.username', read_only=True)
    availableFrom = serializers.DateField(source='start_date', format="%B %d, %Y")
    endDate = serializers.DateField(source='end_date', format="%B %d, %Y")

    class Meta:
        model = ProspectiveListing
        fields = [
            'id',
            'availableFrom',
            'endDate',
            'address',
            'housing_image_base64',
            'contact_info',
            'poster',  # keep poster ID
            'num_bedrooms',
            'num_bathrooms',
            'has_ac',
            'has_wifi',
            'pets_allowed',
            'num_roommates_needed',
            'rent',
            'aboutText',
            'posterUsername'
        ]

