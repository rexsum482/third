from django.views.generic import View
from django.shortcuts import render
from django.http import JsonResponse
from django.utils.timezone import now
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.authtoken.views import ObtainAuthToken
from .mixins import CsrfExemptMixin
from .utils import send_otp_sms
from users.models import PhoneNumber as PhoneOTP

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

def send_otp_view(request):
    phone = request.GET.get('phone')
    if not phone:
        return JsonResponse({'error': 'Phone number required'}, status=400)

    otp_code = PhoneOTP.generate_otp()
    PhoneOTP.objects.update_or_create(phone_number=phone, defaults={'otp': otp_code})

    try:
        send_otp_sms(phone, otp_code)
        return JsonResponse({'message': 'OTP sent successfully'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def verify_otp_view(request):
    phone = request.GET.get('phone')
    otp = request.GET.get('otp')

    try:
        phone_otp = PhoneOTP.objects.get(phone_number=phone)
        if phone_otp.is_expired():
            return JsonResponse({'error': 'OTP expired'}, status=400)
        if phone_otp.otp == otp:
            return JsonResponse({'message': 'Phone verified'})
        return JsonResponse({'error': 'Invalid OTP'}, status=400)
    except PhoneOTP.DoesNotExist:
        return JsonResponse({'error': 'No OTP found for this phone'}, status=404)

