from rest_framework import serializers
from .models import Vehicle, Attribute
from users.serializers import UserSerializer

class AttributeSerializer(serializers.ModelSerializer):
    value = serializers.SerializerMethodField()

    class Meta:
        model = Attribute
        fields = ['name', 'value']

    def get_value(self, obj):
        value = getattr(obj, 'values', None)
        return value.value if value else None


class VehicleSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    attributes = AttributeSerializer(many=True, read_only=True)

    class Meta:
        model = Vehicle
        fields = ['owner', 'VIN', 'plate_num', 'plate_state', 'year', 'make', 'model', 'attributes']
