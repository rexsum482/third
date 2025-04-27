from .models import Booking, Picture
from rest_framework import serializers
from .models import Bay, Job

class BaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Bay
        fields = ['id', 'number']

class PictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Picture
        fields = ['id', 'file_url']

class BookingSerializer(serializers.ModelSerializer):
    pix = PictureSerializer(many=True, required=False)

    class Meta:
        model = Booking
        fields = ['id', 'name', 'number', 'vehicle', 'concerns', 'time_selected', 'created_at', 'pix']

    def create(self, validated_data):
        pix_data = validated_data.pop('pix', [])
        booking = Booking.objects.create(**validated_data)
        for picture in pix_data:
            Picture.objects.create(booking=booking, **picture)
        return booking
    
class JobSerializer(serializers.ModelSerializer):
    booking = BookingSerializer(read_only=True)
    booking_id = serializers.PrimaryKeyRelatedField(
        queryset=Booking.objects.all(), 
        source='booking', 
        write_only=True,
        required=False
    )

    class Meta:
        model = Job
        fields = ['bay', 'booking', 'booking_id', 'start_time', 'end_time']