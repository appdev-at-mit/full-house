from django.db import models


MAX_LENGTHS = {
        "bio": 3000
        "dietary_restrictions": 200
        "animals": 100
        "additional_notes": 2000
    }

CHOICES = { # TODO: add choices for each of these, should be format int: str
        "gender": NotImplemented
        "sexual_orientation": NotImplemented
        "year": NotImplemented
        "sleep_time": NotImplemented
        "wake_time": NotImplemented
        "cleanliness": NotImplemented
        "temperature": NotImplemented
        "noise": NotImplemented
        "guests": NotImplemented
        "sleep_light": NotImplemented
        "sleep_noise": NotImplemented
    }        



# Create your models here.

    class Member(models.Model):
        user = models.OneToOneField(User, on_delete=models.CASCADE)

        verified = models.BooleanField(default= False)


        profile_pic = models.ImageField() # TODO: make default image and upload directory
        bio = models.CharField(max_length=MAX_LENGTHS["bio"])
        school = models.TextField() # initialized upon verification
        date_of_birth = models.DateField(editable=False) # initialized upon verification
        age = models.GeneratedField() # TODO: set up generating expression and required args
        year = models.IntegerField(choices=CHOICES["year"])


        gender = models.IntegerField(choices = CHOICES["gender"])
        sexual_orientation = models.IntegerField(choices=CHOICES["sexual_orientation"])
        dietary_restrictions = models.CharField(max_length=MAX_LENGTHS["dietary_restrictions"])
        sleep_time_weekday = models.IntegerField(choices = CHOICES["sleep_time"])
        sleep_time_weekend = models.IntegerField(choices = CHOICES["sleep_time"])
        wake_time_weekday = models.IntegerField(choices = CHOICES["wake_time"])
        wake_time_weekend = models.IntegerField(choices = CHOICES["wake_time"])
        animals = models.CharField(max_length=MAX_LENGTHS["animals"])
        additional_notes = models.CharField(max_length = MAX_LENGTHS["additional_notes"])

        # PREFERENCES they would like out of the other roommate
        # Some of these have defaults, "don't care" is a specific option they must opt into
        pref_gender = models.IntegerField(choices = CHOICES["gender"])
        pref_smoking =  models.BooleanField(default=False) 
        pref_cleaniness = models.IntegerField(choices = CHOICES["cleanliness"])
        pref_temperature = models.IntegerField(choices= CHOICES["temperature"])
        pref_noise = models.IntegerField(choices=CHOICES["noise"])
        pref_age_min = models.IntegerField()
        pref_age_max = models.IntegerField()
        pref_day_guests = models.IntegerField(choices=CHOICES["guests"])
        pref_night_guests = models.IntegerField(choices=CHOICES["guests"])
        pref_animals = models.BooleanField(default= True)
        pref_sleep_light = models.IntegerField(choices=CHOICES["sleep_light"])
        pref_sleep_noise = models.IntegerField(choices=CHOICES["sleep_noise")



        
