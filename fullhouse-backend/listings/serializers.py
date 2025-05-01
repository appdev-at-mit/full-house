from rest_framework import serializers
from .models import ProspectiveListing

class ProspectiveListingSerializer(serializers.ModelSerializer):
    poster_name = serializers.CharField(source='poster.user.username', read_only=True)
    poster_profile_picture = serializers.CharField(source='poster.profile_picture', read_only=True)

    class Meta:
        model = ProspectiveListing
        fields = [
            'id', 'start_date', 'end_date', 'address', 'housing_image_base64',
            'contact_info', 'poster_name', 'poster_profile_picture', 'num_bedrooms',
            'num_bathrooms', 'has_ac', 'has_wifi', 'pets_allowed', 'num_roommates_needed',
            'rent'
        ] 