from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from .models import Service
from .serializers import ServiceSerializer
from backend.permissions import IsSuperUserOrReadOnly

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsSuperUserOrReadOnly]