# Generated by Django 4.2.5 on 2024-12-04 08:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('prudence', '0008_risk_assigned_to'),
    ]

    operations = [
        migrations.RenameField(
            model_name='risk',
            old_name='assigned_to',
            new_name='assessor',
        ),
    ]