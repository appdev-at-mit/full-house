from django import forms
from .models import Member

class MemberForm(forms.ModelForm):
    class Meta:
        model = Member
        fields = [
            'bio', 
            'school', 
            'year', 
            'phone_num',
            'gender', 
            'dietary_restrictions', 
            'sleep_time_weekday',
            'sleep_time_weekend', 
            'wake_time_weekday', 
            'wake_time_weekend',
            'animals', 
            'additional_notes', 
            'pref_same_gender', 
            'pref_smoking',
            'pref_cleanliness', 
            'pref_temperature', 
            'pref_age_min',
            'pref_age_max', 
            'pref_day_guests', 
            'pref_night_guests',
            'pref_animals', 
            'pref_sleep_light'
        ]
