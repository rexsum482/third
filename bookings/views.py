from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Booking, Picture, Bay, JOBS, JOB_INFO, get_next_available_time, Job
from .serializers import BookingSerializer, BaySerializer, JobSerializer
import boto3
import uuid
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from .models import SLOT_DURATION
from collections import defaultdict
from django.utils.timezone import now, make_aware, get_current_timezone
from datetime import datetime, time, timedelta
from django.utils.dateparse import parse_date
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

BUSINESS_HOURS_START = 8
BUSINESS_HOURS_END = 18

def deduplicate_slots(slots):
    unique = defaultdict(dict)
    for day, slot_list in slots.items():
        for slot in slot_list:
            key = (slot["available_time"], slot["end_time"], slot["duration"])
            bay = slot["bay"]
            if key not in unique[day]:
                unique[day][key] = {"available_time": key[0], "end_time": key[1], "duration": key[2], "bays": set()}
            unique[day][key]["bays"].add(bay)

    deduped = {}
    for day, slot_dict in unique.items():
        deduped[day] = [
            {
                "available_time": val["available_time"],
                "end_time": val["end_time"],
                "duration": val["duration"],
                "bays": sorted(val["bays"]),
            }
            for val in sorted(slot_dict.values(), key=lambda x: x["available_time"])
        ]
    return deduped


def get_next_business_days(start_date, count=7):
    days = []
    current = start_date
    while len(days) < count:
        if current.weekday() < 5:
            days.append(current)
        current += timedelta(days=1)
    return days


def get_daily_slots(day):
    slots = []
    start_time = datetime.combine(day, time(hour=BUSINESS_HOURS_START))
    end_time = datetime.combine(day, time(hour=BUSINESS_HOURS_END))
    current = start_time
    while current + SLOT_DURATION <= end_time:
        slots.append(make_aware(current, get_current_timezone()))
        current += SLOT_DURATION
    return slots

def is_slot_available(bay_jobs, slot_block):
    for job in bay_jobs:
        for slot in slot_block:
            if job.start_time < slot + SLOT_DURATION and job.end_time > slot:
                return False
    return True


@api_view(['POST'])
@permission_classes([AllowAny])
def available_times(request):
    job_names = request.data.get('jobs')

    if not job_names or not isinstance(job_names, list):
        return Response({'error': 'Please provide a list of job names under "jobs"'}, status=400)

    total_periods = 0
    bay_required = False

    for job in job_names:
        if job not in JOBS:
            total_periods += 4
            bay_required = True
            continue
        total_periods += JOB_INFO[job]['periods']
        if JOB_INFO[job]['bay_required']:
            bay_required = True
    if total_periods > 12:
        total_periods = 12
    if total_periods < 2:
        total_periods = 2
    if not bay_required:
        soonest = now() + SLOT_DURATION * 2
        grouped_times = defaultdict(list)
        today = now().date()
        business_days = get_next_business_days(today, count=7)
        for day in business_days:
            daily_slots = get_daily_slots(day)
            for i in range(len(daily_slots) - total_periods + 1):
                block = daily_slots[i:i + total_periods]
                start_slot = block[0]
                if start_slot < soonest:
                    continue
                grouped_times[str(day)].append({
                    "available_time": block[0],
                    "end_time": block[-1] + SLOT_DURATION,
                    "duration": total_periods * SLOT_DURATION
		})
        return Response(grouped_times)

    current_time = now()
    cutoff_time = current_time + timedelta(hours=1)
    grouped_times = defaultdict(list)
    today = now().date()
    business_days = get_next_business_days(today, count=7)

    for bay in Bay.objects.all():
        bay_jobs = list(Job.objects.filter(bay=bay, start_time__gte=make_aware(datetime.combine(today, time.min))))

        for day in business_days:
            daily_slots = get_daily_slots(day)
            for i in range(len(daily_slots) - total_periods + 1):
                block = daily_slots[i:i + total_periods]
                start_slot = block[0]

                if start_slot < cutoff_time:
                    continue 

                if is_slot_available(bay_jobs, block):
                    grouped_times[str(day)].append({
                        "available_time": block[0],
                        "end_time": block[-1] + SLOT_DURATION,
                        "duration": total_periods * SLOT_DURATION,
                        "bay": bay.number,
                    })

    return Response(deduplicate_slots(grouped_times))

@method_decorator(csrf_exempt, name='dispatch')
class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Job.objects.all()
        date_param = self.request.query_params.get('date', None)

        if date_param:
            try:
                # Parse the date from the query parameter
                date_obj = parse_date(date_param)
                if date_obj:
                    # Filter jobs based on the date
                    queryset = queryset.filter(start_time__date=date_obj)
                else:
                    # If the date is invalid, return an empty queryset or handle it as needed
                    queryset = Job.objects.none()
            except ValueError:
                # Handle invalid date format gracefully (optional)
                queryset = Job.objects.none()

        return queryset

@api_view(['POST'])
@permission_classes([AllowAny])
def generate_presigned_url(request):
    file_name = request.data.get('file_name')
    file_type = request.data.get('file_type')

    if not file_name or not file_type:
        return Response({'error': 'Missing file_name or file_type'}, status=400)

    s3 = boto3.client('s3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME
    )

    unique_filename = f"{uuid.uuid4().hex}_{file_name}"
    upload_key = f"bookings/{unique_filename}"

    presigned_url = s3.generate_presigned_url(
        'put_object',
        Params={
            'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
            'Key': upload_key,
            'ContentType': file_type,
            'ACL': 'public-read'  # optional: make files public
        },
        ExpiresIn=3600
    )

    file_url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{upload_key}"

    return Response({
        'upload_url': presigned_url,
        'file_url': file_url
    })

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    authentication_classes = []
    permission_classes = []

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        return Booking.objects.none()

    def perform_create(self, serializer):
        booking = serializer.save()
        for f in self.request.FILES.getlist('pictures'):
            Picture.objects.create(booking=booking, file=f)

class BayViewSet(viewsets.ModelViewSet):
    queryset = Bay.objects.all()
    serializer_class=BaySerializer
    permission_classes = [AllowAny]
