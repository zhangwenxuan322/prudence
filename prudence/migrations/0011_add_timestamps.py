# Generated by Django 5.0.6 on 2025-07-14 12:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('prudence', '0010_riskassessment'),
    ]

    operations = [
        migrations.AddField(
            model_name='control',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='control',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
        migrations.AddField(
            model_name='risk',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='risk',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
    ]
