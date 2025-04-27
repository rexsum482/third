from rest_framework import viewsets
from .serializers import MailingList, MailingListSerializer
from rest_framework.permissions import AllowAny

class MailingListViewSet(viewsets.ModelViewSet):
    queryset = MailingList.objects.all()
    serializer_class = MailingListSerializer
    permission_classes = [AllowAny]
    http_method_names = ['post']