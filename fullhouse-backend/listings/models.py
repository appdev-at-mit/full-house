from django.db import models
from accounts.models import Member

class ProspectiveListing(models.Model):
    """
    Stores information regarding the Member's listing; that is, a lease that they already
    have (or plan to have) that they are garnering roommates for. Inherits from ProspectiveStay.

    Search will only look for Members with an active prospective stay (not listing). Search will
    only consider Members with prospective stays strictly within the listing window. 
    """
    
    start_date = models.DateField()
    end_date = models.DateField()
    address = models.CharField(max_length=500)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=2)
    housing_image_base64 = models.TextField(blank=True, null=True)
    contact_info = models.CharField(max_length=200)
    poster = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="prospective_listings")
    num_bedrooms = models.PositiveIntegerField()
    num_bathrooms = models.PositiveIntegerField()
    has_ac = models.BooleanField(default=False)
    has_wifi = models.BooleanField(default=False)
    pets_allowed = models.BooleanField(default=False)
    num_roommates_needed = models.PositiveIntegerField()
    rent = models.DecimalField(max_digits=10, decimal_places=2)
