from .models import Service
from rest_framework import serializers

class ServiceSerializer(serializers.ModelSerializer):
    image = serializers.URLField(required=False, allow_blank=True)

    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'image']