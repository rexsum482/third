from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt, csrf_protect

class CsrfExemptMixin:
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

class CsrfProtectMixin:
    @method_decorator(csrf_protect)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
