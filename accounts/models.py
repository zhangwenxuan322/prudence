from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    L1 = 'L1'
    L2 = 'L2'
    L3 = 'L3'
    ROLE_CHOICES = [
        (L1, 'L1'),
        (L2, 'L2'),
        (L3, 'L3'),
    ]
    role = models.CharField(max_length=2, choices=ROLE_CHOICES, default=L1)
