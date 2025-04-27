from django.views.generic import View
from django.shortcuts import render
from django.http import JsonResponse
from django.utils.timezone import now
# from .serializers import Event, EventSerializer
# from rest_framework import viewsets

def server_time(request):
    return JsonResponse({"server_time": now().isoformat()})

class FrontendAppView(View):
    def get(self, request):
        return render(request, 'index.html')

# class EventViewSet(viewsets.ModelViewSet):
#     queryset = Event.objects.all()
#     serializer_class = EventSerializer