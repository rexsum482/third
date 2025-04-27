from rest_framework import viewsets
from .serializers import ShopSerializer, Shop
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN, HTTP_405_METHOD_NOT_ALLOWED

UNSAFE_METHODS = ["PUT", "POST", "PATCH", "DELETE"]

class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()
    serializer_class=ShopSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]

    def get_permissions(self):
        if self.request.method in UNSAFE_METHODS:
            return [IsAdminUser]
        return [AllowAny]