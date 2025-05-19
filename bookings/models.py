from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import EmailMultiAlternatives
from django.utils.html import format_html_join
from django.utils import timezone
from datetime import timedelta, datetime, time
from shops.models import Shop

class Bay(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='bays', blank=True, null=True)
    number = models.PositiveIntegerField()

    def __str__(self):
        if self.shop:
            return f"Store #{self.shop.id} [{self.shop.name}] - Bay #{self.number}"
        else:
            return f"No Store defined: Bay #{self.number}"

    def save(self, *args, **kwargs):
        if self.shop:
            bays = Bay.objects.filter(shop=self.shop)
            bay_numbers = []
            for bay in bays:
                if int(bay.number) == int(self.number):
                    raise Exception
                bay_numbers.append(bay.number)
            if int(self.number) in bay_numbers:
                raise Exception
        return super().save(*args, **kwargs)


WORK_START = time(8, 0)
WORK_END = time(18, 0)
SLOT_DURATION = timedelta(minutes=30)

JOBS = [
    ("Oil Change", 3, True), 
    ("State Inspection", 1, False), 
    ("Brakes", 4, True), 
    ("Suspension", 4, True), 
    ("Transmission", 8, True),
    ("Cooling System", 2, False), 
    ("Fuel System", 3, False), 
    ("Exhaust", 4, True), 
    ("Air Intake", 2, False), 
    ("Electronic", 4, False), 
    ("Steering", 3, False),
    ("Check Engine Light", 2, False),
]

JOB_INFO = {job[0]: {"periods": job[1], "bay_required": job[2]} for job in JOBS}

def get_next_available_time(bay=None, periods=1):
    now = timezone.now()
    earliest = now + 2 * SLOT_DURATION
    
    def start_of_day(dt):
        return datetime.combine(dt.date(), WORK_START, tzinfo=dt.tzinfo)

    def end_of_day(dt):
        return datetime.combine(dt.date(), WORK_END, tzinfo=dt.tzinfo)

    while True:
        day_start = start_of_day(earliest)
        day_end = end_of_day(earliest)
        slots_available = (day_end - max(day_start, earliest)) // SLOT_DURATION

        if slots_available >= periods:
            if not bay:
                return max(day_start, earliest)
            in_use_until = bay.in_use_until or now
            available_time = max(earliest, in_use_until)
            if (day_end - available_time) >= (SLOT_DURATION * periods):
                return available_time
        earliest = day_start + timedelta(days=1)

class Booking(models.Model):
    name = models.CharField(max_length=128, default=".")
    number = models.CharField(max_length=24, default=".")
    vehicle = models.CharField(max_length=256)
    concerns = models.TextField()
    time_selected = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.vehicle} ({self.created_at})"

class Picture(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='pix')
    file_url = models.URLField(max_length=1024, blank=True, null=True)

    def __str__(self):
        return f"Picture for Booking ID {self.booking.id}"

class Job(models.Model):
    bay = models.ForeignKey(Bay, on_delete=models.CASCADE, related_name='jobs')
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='details', blank=True, null=True)
    start_time = models.DateTimeField(blank=True, null=True)
    end_time = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f'Bay {self.bay.id}: {self.start_time}-{self.end_time}'

@receiver(post_save, sender=Job)
def send_notification(sender, instance=None, created=False, **kwargs):
    if created:
        if instance.booking:
            subject = f'New Booking - {instance.booking.id} {instance.booking.vehicle}'
            text_body = f"""
            Name: {instance.booking.name}
            Number: {instance.booking.number}
            Vehicle: {instance.booking.vehicle}
            Concerns: {instance.booking.concerns}
            Time Frame: {instance.start_time.strftime('%A, %B %d, %Y at %I:%M %p')} - {instance.end_time.strftime('%A, %B %d, %Y at %I:%M %p')}
            """

            # Build HTML body
            image_tags = format_html_join(
                '\n', '<img src="{}" style="max-width: 500px; margin-top: 10px;" />',
                ((pic.file_url,) for pic in instance.booking.pix.all() if pic.file_url)
            )

            html_body = f"""
            <p><strong>Name:</strong> {instance.booking.name}</p>
            <p><strong>Number:</strong> {instance.booking.number}</p>
            <p><strong>Vehicle:</strong> {instance.booking.vehicle}</p>
            <p><strong>Concerns:</strong> {instance.booking.concerns}</p>
            <p><strong>Photos:</strong><br>{image_tags}</p>
            <p><strong>Time Frame:</strong> {instance.start_time.strftime('%A, %B %d, %Y at %I:%M %p')}-{instance.end_time.strftime('%A, %B %d, %Y at %I:%M %p')}
            """

            # Create email with HTML alternative
            email = EmailMultiAlternatives(
                subject,
                text_body,
                'dontreply@thirdstreetgarage.com',
                ['arjeff482@gmail.com', '3rdstreetgarage@att.net']
            )
            email.attach_alternative(html_body, "text/html")

            email.send(fail_silently=False)
