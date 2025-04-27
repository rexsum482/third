from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import PhoneNumber
User = get_user_model()

class PhoneNumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhoneNumber
        fields = ["id", "user", "number"]
        extra_kwargs = {
            'user': {'write_only': True}
        }

class UserSerializer(serializers.ModelSerializer):
    phone_numbers = PhoneNumberSerializer(source='phones', many=True, read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'phone_numbers', 'is_active', 'is_staff', 'is_superuser', 'last_active', 'ip_address']
        extra_kwargs = {
            'password': {'write_only': True},
            'ip_address': {'read_only': True},
            'is_superuser': {'read_only': True},
            'is_staff': {'read_only': True},
            'is_active': {'read_only': True},
            'last_active': {'read_only': True},
        }

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username'].lower().replace(" ", ""),
        )
        user.set_password(validated_data['password']) 
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username).lower().replace(" ", "")
        instance.email = validated_data.get('email', instance.email)
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance
