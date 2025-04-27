from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.status import HTTP_405_METHOD_NOT_ALLOWED
from rest_framework.pagination import PageNumberPagination
from .serializers import ReviewSerializer, Review

class TenPerPagePagination(PageNumberPagination):
    page_size = 10

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.order_by('-id')  # Latest first
    serializer_class = ReviewSerializer
    pagination_class = TenPerPagePagination

    def update(self, request, *args, **kwargs):
        return Response({'error': 'Reviews cannot be edited.'}, status=HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, *args, **kwargs):
        return Response({'error': 'Reviews cannot be deleted.'}, status=HTTP_405_METHOD_NOT_ALLOWED)
