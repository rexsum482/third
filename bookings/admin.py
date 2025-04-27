from django.contrib import admin
from .models import Booking, Picture, Bay, Job

admin.site.register([Booking, Picture, Bay, Job])