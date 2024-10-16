from django.db import models
from accounts.models import Member

# Create your models here.


class ProspectiveStay(models.Model):
    """
    Stores information regarding the Member's prospective plans for housing, including
    start date, end date, and location. Optionally they can add a short bio to this as well.

    Search will look for Members with an active prospective stay or a prospective listing.

    In a many to one relationship with the Member class. Members should open a new stay 
    each year if they use this for multiple years. The current prospective stay is
    kept track of.

    The approx_length field is stored in months and automatically rounded up for simplicity,
    but exact durations are also calculated.
    """

    start_date = models.DateField()
    end_date = models.DateField()
    location = models.CharField(max_length=300)



class ProspectiveListing(models.Model):
    """
    Stores information regarding the Member's listing; that is, a lease that they already
    have (or plan to have) that they are garnering roommates for. Inherits from ProspectiveStay.

    Search will only look for Members with an active prospective stay (not listing). Search will
    only consider Members with prospective stays strictly within than the listing window. 
    """
    start_date = models.DateField()



    
