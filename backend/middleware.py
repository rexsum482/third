from django.utils.deprecation import MiddlewareMixin
from django.utils.timezone import now
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from rest_framework.authentication import get_authorization_header
from rest_framework.exceptions import AuthenticationFailed
import logging
import traceback

logger = logging.getLogger(__name__)

class LogPostBodyOnErrorMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            request.body_data = request.body
        except Exception:
            request.body_data = b''

        response = self.get_response(request)
        return response

    def process_exception(self, request, exception):
        if request.method == "POST":
            try:
                logger.error(
                    "POST request caused an error\nURL: %s\nBody: %s",
                    request.build_absolute_uri(),
                    request.body_data.decode('utf-8', errors='replace')
                )
            except Exception as e:
                logger.error("Error logging POST body: %s", str(e))

User = get_user_model()

class UserActivityLoggingMiddleware(MiddlewareMixin):

    def process_request(self, request):
        self.authenticate_user(request)
        self.update_active(request)
        self.update_ip_address(request)

    def authenticate_user(self, request):
        auth = get_authorization_header(request).split()
        if not auth or auth[0].lower() != b'token':
            return

        if len(auth) == 1:
            raise AuthenticationFailed('Invalid token header. No credentials provided.')
        elif len(auth) > 2:
            raise AuthenticationFailed('Invalid token header. Token string should not contain spaces.')

        try:
            token = auth[1].decode()
        except UnicodeError:
            raise AuthenticationFailed('Invalid token header. Token string should not contain invalid characters.')

        try:
            token_obj = Token.objects.get(key=token)
        except Token.DoesNotExist:
            raise AuthenticationFailed('Invalid token.')

        request.user = token_obj.user

    def update_active(self, request):
        if hasattr(request, 'user') and request.user.is_authenticated:
            request.user.last_active = now()
            request.user.save()

    def update_ip_address(self, request):
        if hasattr(request, 'user') and request.user.is_authenticated:
            ip_address = request.META.get('REMOTE_ADDR')
            if ip_address and request.user.ip_address != ip_address:
                request.user.ip_address = ip_address
                request.user.save()


class LogExceptionsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            return self.get_response(request)
        except Exception:
            logger.error("Unhandled exception:\n%s", traceback.format_exc())
            raise
