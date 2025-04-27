from django.db import models

class MailingList(models.Model):
    email = models.EmailField()