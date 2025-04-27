from rest_framework import serializers
from users.serializers import UserSerializer
from .models import Shop
class ShopSerializer(serializers.ModelSerializer):
    owner = UserSerializer(many=False, read_only=True)
    class Meta:
        models = Shop
        fields = ['owner', 'name']