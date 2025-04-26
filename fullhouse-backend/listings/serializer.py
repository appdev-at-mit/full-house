# listings/serializers.py
from rest_framework import serializers
from .models import ProspectiveListing

class ProspectiveListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProspectiveListing
        fields = '__all__'
