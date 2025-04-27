from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from services.views import ServiceViewSet
from users.views import UserViewSet, PhoneNumberViewSet
from rest_framework.authtoken.views import ObtainAuthToken
from .views import FrontendAppView, server_time
from vehicles.views import VehicleViewSet
from bookings.views import BayViewSet, BookingViewSet, generate_presigned_url, available_times, get_next_available_time, JobViewSet
from reviews.views import ReviewViewSet
from mailinglist.views import MailingListViewSet
from shops.views import ShopViewSet

router = DefaultRouter()
router.register('users', UserViewSet, basename='user')
router.register('services', ServiceViewSet, basename='service')
router.register('vehicles', VehicleViewSet, basename='vehicle')
router.register('bookings', BookingViewSet, basename='booking')
router.register('reviews', ReviewViewSet, basename='review')
router.register('jobs', JobViewSet, basename='job')
router.register('bays', BayViewSet, basename='bay')
router.register('shops', ShopViewSet, basename='shop')
router.register('phones', PhoneNumberViewSet, basename='phone')
router.register('mailing-list', MailingListViewSet, basename='mailinglist')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('auth/', ObtainAuthToken.as_view(), name='get_token'),
    path('server-time/', server_time, name='server_time'),
    path('upload-url/', generate_presigned_url, name='generate_upload_url'),
    path('available-times/', available_times, name='available_times'),
    path('get-next-available/', get_next_available_time, name='get_next_available_time')

]

urlpatterns += re_path(r'^.*$', FrontendAppView.as_view(), name='index'),