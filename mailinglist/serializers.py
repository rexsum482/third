from rest_framework import serializers
from .models import MailingList

class MailingListSerializer(serializers.ModelSerializer):
    class Meta:
        model = MailingList
        fields = 'email'
        