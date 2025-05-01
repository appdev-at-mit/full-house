from rest_framework import serializers
from django.contrib.auth.models import User
from accounts.models import Member

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "password", "email", "first_name", "last_name"]
        extra_kwargs = {
            "password": {"write_only": True},
        }

class MemberSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Member
        fields = [
            "user",
            "verified",
            "rooming_status",
            "profile_pic",
            "bio",
            "school",
            "year",
            "phone_num",
            "gender",
            "dietary_restrictions",
            "sleep_time_weekday",
            "sleep_time_weekend",
            "wake_time_weekday",
            "wake_time_weekend",
            "animals",
            "additional_notes",
            "pref_same_gender",
            "pref_smoking",
            "pref_cleanliness",
            "pref_temperature",
            "pref_age_min",
            "pref_age_max",
            "pref_day_guests",
            "pref_night_guests",
            "pref_animals",
            "pref_sleep_light",
            "date_of_birth",
            "account_creation_date",
            "age",
            "city_name",
            "state_name",
            "city_coords",
        ]
        read_only_fields = [
            "date_of_birth",
            "account_creation_date",
            "age",
            "city_coords",
        ]
        extra_kwargs = {
            "phone_num": {"write_only": True},
        }

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        user = User.objects.create(**user_data)
        member = Member.objects.create(user=user, **validated_data)
        return member

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", None)
        if user_data:
            for attr, value in user_data.items():
                setattr(instance.user, attr, value)
            instance.user.save()
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
