from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import EmailMultiAlternatives

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Message from {self.name}'

@receiver(post_save, sender=ContactMessage)
def send_notification(sender, instance=None, created=False, **kwargs):
    if created:
        subject = f'New Message From {instance.name} ({instance.email})'
        text_body = f"""
        Name: {instance.name}
        Email: {instance.email}
        Message: {instance.message}
        Created At: {instance.created_at}
        """
        email = EmailMultiAlternatives(
            subject,
            text_body,
            'dontreply@thirdstreetgarage.com',
            ['arjeff482@gmail.com', '3rdstreetgarage@att.net']
        )

        email.send(fail_silently=False)
