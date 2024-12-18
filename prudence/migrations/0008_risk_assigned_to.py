# Generated by Django 4.2.5 on 2024-12-04 07:58

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('prudence', '0007_control_clastassessed'),
    ]

    operations = [
        migrations.AddField(
            model_name='risk',
            name='assigned_to',
            field=models.ForeignKey(limit_choices_to={'role': 'L2'}, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='risks_assigned', to=settings.AUTH_USER_MODEL),
        ),
    ]
