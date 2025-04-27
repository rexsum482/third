import requests
from django.core.management.base import BaseCommand
from services.models import Service

class Command(BaseCommand):
    help = "Import services from remote API"

    def handle(self, *args, **kwargs):
        url = 'http://18.191.239.250/api/services/'

        try:
            response = requests.get(url)
            response.raise_for_status()
        except requests.RequestException as e:
            self.stderr.write(self.style.ERROR(f"Error fetching services: {e}"))
            return

        services_data = response.json()

        created_count = 0
        for service in services_data:
            obj, created = Service.objects.update_or_create(
                name=service['name'],
                defaults={
                    'description': service.get('description', ''),
                    'image': service.get('image', None),
                }
            )
            if created:
                created_count += 1

        self.stdout.write(self.style.SUCCESS(f"Imported {created_count} new services."))
