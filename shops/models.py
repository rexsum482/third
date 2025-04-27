from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Shop(models.Model):
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name="shops")
    name = models.CharField(max_length=128)

    def __str__(self):
        return f'{self.name}'