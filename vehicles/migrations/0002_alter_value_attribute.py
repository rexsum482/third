# Generated by Django 5.2 on 2025-04-13 20:52

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vehicles', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='value',
            name='attribute',
            field=models.OneToOneField(on_delete=django.db.models.deletion.DO_NOTHING, related_name='values', to='vehicles.attribute'),
        ),
    ]
