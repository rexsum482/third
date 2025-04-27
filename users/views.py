from rest_framework import viewsets, status
from .serializers import UserSerializer
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.status import HTTP_403_FORBIDDEN, HTTP_205_RESET_CONTENT, HTTP_400_BAD_REQUEST, HTTP_201_CREATED

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            if self.request.user.is_superuser:
                return User.objects.all()
            return User.objects.filter(id=self.request.user.id)
        return User.objects.none()
        
    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def verify(self, request):
        token = request.data.get("token")
        if not token:
            return Response({"detail": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)
        user_token = Token.objects.filter(key=token).first()
        if not user_token:
            return Response({"detail": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Token is valid"}, status=status.HTTP_200_OK)
    
    def get_authenticators(self):
        if self.request.method == 'POST':
            return []
        return [TokenAuthentication()]
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return []
        return [IsAuthenticated()]

    def create(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
    
    def destroy(self, request):
        if self.request.user.is_superuser:
            user_id = request.query_params.get('id')
            if not user_id:
                return Response({'error': 'User ID is required'}, status=HTTP_400_BAD_REQUEST)

            user_id = request.query_params.get('pk')
            if not user_id or not user_id.isdigit():
                return Response({'error': 'Valid user ID is required'}, status=HTTP_400_BAD_REQUEST)
            user = User.objects.filter(id=user_id).first()
            if not user:
                return Response({'error': 'User not found'}, status=HTTP_400_BAD_REQUEST)
            if user == self.request.user:
                return Response({'error': 'You cannot deactivate yourself'}, status=HTTP_400_BAD_REQUEST)

            user.is_active = False
            user.save()
            return Response(status=HTTP_205_RESET_CONTENT)
        
        return Response(status=HTTP_403_FORBIDDEN)