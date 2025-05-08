from django.views.generic import View
from django.shortcuts import render
from django.http import JsonResponse
from django.utils.timezone import now
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.authtoken.views import ObtainAuthToken
from .mixins import CsrfExemptMixin

def server_time(request):
    return JsonResponse({"server_time": now().isoformat()})

class FrontendAppView(View):
    def get(self, request):
        return render(request, 'index.html')

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'detail': 'CSRF cookie set'})

@method_decorator(csrf_exempt, name='dispatch')
class GetAuth(ObtainAuthToken):
    def get(self, request):
        return JsonResponse({"error": "Method not allowed"})
