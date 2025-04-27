import os
import uuid
from django.db import models

def unique_image_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    return os.path.join('services/', filename)

class Service(models.Model):
    name = models.CharField(max_length=64)
    description = models.TextField()
    image = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.name}"