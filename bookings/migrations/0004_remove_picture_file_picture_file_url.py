# Generated by Django 5.2 on 2025-04-20 00:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookings', '0003_booking_vehicle'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='picture',
            name='file',
        ),
        migrations.AddField(
            model_name='picture',
            name='file_url',
            field=models.URLField(blank=True, max_length=1024, null=True),
        ),
    ]
