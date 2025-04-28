from django.views.generic import View
from django.shortcuts import render
from django.http import JsonResponse
from django.utils.timezone import now
from django.views.decorators.csrf import ensure_csrf_cookie

def server_time(request):
    return JsonResponse({"server_time": now().isoformat()})

class FrontendAppView(View):
    def get(self, request):
        return render(request, 'index.html')

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'detail': 'CSRF cookie set'})
