from django.db import models
from django.contrib.auth.models import User
from phonenumber_field.modelfields import PhoneNumberField





# Create your models here.

class Member(models.Model):
    """
    A person using Full House. OneToOne relation with the built in User class.
    Contains general demographic information, as well as preferences for future roommates.
    Most important attributes:
        verified: boolean, represents whether or not the user has been background checked.
            NO USER SHOULD HAVE ACCESS TO OTHERS PROFILES WITHOUT THIS BEING TRUE.
            They may still set their own preferences, but their listing will not be displayed.
        status: represents whether or not the user is actually looking for a roommate/housing.
    """

    MAX_LENGTHS = {
            "bio": 3000,
            "dietary_restrictions": 200,
            "animals": 100,
            "additional_notes": 2000,
            }

    # a bunch of classes of choices for various fields
    class Status(models.IntegerChoices):
        INACTIVE = 0, "Not looking for housing"
        FIND_HOUSING = 1, "Looking for housing"
        FIND_ROOMMATE = 2, "Have housing plans and looking for roommate(s)"

    class Gender(models.IntegerChoices): # this was modeled after USAO roommate preference form
        MALE = 0, "Male"
        FEMALE = 1, "Female"
        TRANSMALE = 2, "Transmale"
        TRANSFEMALE = 3, "Transfemale"
        NEUTRAL = 4, "Neutral/Other"
        NO_SELECTION = 5, "Prefer not to say"

    class Year(models.IntegerChoices): 
        UG_1 = 0, "Freshman Undergraduate"
        UG_2 = 1, "Sophomore Undergraduate"
        UG_3 = 2, "Junior Undergraduate"
        UG_4 = 3, "Senior Undergraduate"
        UG_5 = 4, "Fifth-year Undergraduate"
        GRAD = 5, "Graduate Student"

    class SleepTime(models.IntegerChoices):
        VERY_EARLY = 0, "Before 9:00 PM"
        EARLY = 1, "Between 9:00 PM and 11:00 PM"
        LATE = 2, "Between 11:00 PM and 1:00 AM"
        VERY_LATE = 3, "After 1:00 AM"

    class WakeTime(models.IntegerChoices):
        VERY_EARLY = 0, "Before 7:00 AM"
        EARLY = 1, "Between 7:00 AM and 9:00 AM"
        LATE = 2, "Between 9:00 AM and 11:00 AM"
        VERY_LATE = 3, "After 11:00 AM"

    class Cleanliness(models.IntegerChoices):
        VERY_CLEAN = 0, "I prefer my living space to be neat and clean all of the time"
        SEMI_CLEAN = 1, "I like my living space to be clean but I can tolerate some clutter"
        NO_PREFERENCE = 2, "Mess/clutter does not bother me"

    class Temperature(models.IntegerChoices):
        WARM = 0, "I prefer a relatively warm temperature (above 72F/22C)"
        COOL = 1, "I prefer a relatively cool temperature (below 68F/20C)"
        NO_PREFERENCE = 2, "No preference"

    class GuestPolicy(models.IntegerChoices):
        STRICT = 0, "Guests should always be coordinated to make sure everyone is comfortable."
        FLEXIBLE = 1, "Let's talk together about what rules we want to set about guests coming over."
        NO_PREFERENCE = 2, "Spontaneity is great! Anything (within reason) is fine by me."

    class SleepLightLevel(models.IntegerChoices):
        LIGHTS_ON = 0, "Lights on"
        SOME_LIGHT = 1, "Some minimal light"
        NO_LIGHT = 2, "Completely dark"
        NO_PREFERENCE = 3, "No preference"

    # actual attributes
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    verified = models.BooleanField(default= False)
    rooming_status = models.CharField(choices=Status.choices, max_length=200)


    profile_pic = models.ImageField() # TODO: make default image and upload directory
    bio = models.CharField(max_length=MAX_LENGTHS["bio"])
    school = models.TextField() # initialized upon verification
    date_of_birth = models.DateField(editable=False) # initialized upon verification
    # age = models.GeneratedField(expression=18, 
    #                             output_field=models.IntegerField, 
    #                             db_persist=True) # TODO: set up generating expression and required args
    year = models.IntegerField(choices=Year.choices)
    phone_num = PhoneNumberField(blank=False, max_length=300)

    gender = models.IntegerField(choices = Gender.choices)
    dietary_restrictions = models.CharField(max_length=MAX_LENGTHS["dietary_restrictions"], blank=True)
    sleep_time_weekday = models.IntegerField(choices = SleepTime.choices)
    sleep_time_weekend = models.IntegerField(choices = SleepTime.choices)
    wake_time_weekday = models.IntegerField(choices = WakeTime.choices)
    wake_time_weekend = models.IntegerField(choices = WakeTime.choices)
    animals = models.CharField(max_length=MAX_LENGTHS["animals"], blank=True)
    additional_notes = models.CharField(max_length = MAX_LENGTHS["additional_notes"], blank=True)

    # PREFERENCES they would like out of the other roommate
    # Some of these have defaults, "don't care" is a specific option they must opt into
    pref_same_gender = models.BooleanField(default=True)
    pref_smoking =  models.BooleanField(default=False) 
    pref_cleaniness = models.IntegerField(choices = Cleanliness.choices)
    pref_temperature = models.IntegerField(choices= Temperature.choices)
    pref_age_min = models.IntegerField(blank=True)
    pref_age_max = models.IntegerField(blank=True)
    pref_day_guests = models.IntegerField(choices= GuestPolicy.choices)
    pref_night_guests = models.IntegerField(choices= GuestPolicy.choices)
    pref_animals = models.BooleanField(default= True)
    pref_sleep_light = models.IntegerField(choices= SleepLightLevel.choices)

