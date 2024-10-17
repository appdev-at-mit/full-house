from rest_framework import serializers

from accounts.models import Member

class MemberSerializer(serializers.ModelSerializer):

    class Meta:
        model = Member
        fields = ["user", 
                  "verified",
                  "rooming_status",
                  "profle_pic",
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
                  ]
        read_only_fields = ["date_of_birth",
                            "account_creation_date",
                            ]


