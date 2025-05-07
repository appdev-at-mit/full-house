from django import forms
from .models import ProspectiveListing

class ProspectiveListingForm(forms.ModelForm):
    class Meta:
        model = ProspectiveListing
        fields = [
            'start_date', 'end_date', 'address', 'city', 'state', 'housing_image_base64',
            'contact_info', 'poster', 'num_bedrooms', 'num_bathrooms',
            'has_ac', 'has_wifi', 'pets_allowed', 'num_roommates_needed', 'rent'
        ]
