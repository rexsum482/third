from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Vehicle(models.Model):
    owner = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='cars')
    VIN = models.CharField(max_length=32, blank=True, null=True)
    plate_num = models.CharField(max_length=10, blank=True, null=True)
    plate_state = models.CharField(max_length=2, blank=True, null=True)
    year = models.CharField(max_length=4, blank=True, null=True)
    make = models.CharField(max_length=64, blank=True, null=True)
    model = models.CharField(max_length=128, blank=True, null=True)

class Attribute(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.DO_NOTHING, related_name='attributes')
    name = models.CharField(max_length=128, blank=True, null=True)

class Value(models.Model):
    attribute = models.OneToOneField(Attribute, on_delete=models.DO_NOTHING, related_name='values')
    value = models.TextField(blank=True, null=True)