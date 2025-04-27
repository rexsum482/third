from backend.resources import lookup_plate
from .models import Vehicle, Attribute, Value
from .serializers import VehicleSerializer
from rest_framework.decorators import action
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_401_UNAUTHORIZED, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_200_OK, HTTP_400_BAD_REQUEST

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    @action(detail=False, methods=['post'], url_path='add-by-plate')
    def add_car_by_plate(self, request):
        plate = request.query_params.get('plate')
        state = request.query_params.get('state', 'TX')

        if not plate:
            return Response({'error': 'Plate parameter is required'}, status=HTTP_400_BAD_REQUEST)

        if not request.user.is_authenticated:
            return Response({'error': 'Must be authenticated to use this feature'}, status=HTTP_401_UNAUTHORIZED)

        data = lookup_plate(plate=plate, state=state)
        if not data:
            return Response({'error': 'Error retrieving Vehicle information'}, status=HTTP_500_INTERNAL_SERVER_ERROR)

        vehicle, _ = Vehicle.objects.get_or_create(
            owner=request.user,
            VIN=data.get('vin', ''),
            year=data.get('year', ''),
            make=data.get('make', ''),
            model=data.get('model', ''),
            plate_num=plate,
            plate_state=state
        )

        vin_data = data.get('vin_data', {})

        for key, val in vin_data.items():
            if not val or val in ['0', 'Not Applicable', '']:
                continue

            if key == 'ErrorText':
                error_code = vin_data.get('ErrorCode')
                if not error_code or error_code in ['0', '', None]:
                    continue

            attribute = Attribute.objects.create(vehicle=vehicle, name=key)
            Value.objects.create(attribute=attribute, value=val)

        return Response({'data': 'Vehicle and attributes created successfully'}, status=HTTP_200_OK)

    def get_queryset(self):
        if self.request.user.is_authenticated:
            user = self.request.user
            if user.is_superuser:
                return super().get_queryset()
            else:
                return Vehicle.objects.filter(owner=user)
        else:
            return Vehicle.objects.none()