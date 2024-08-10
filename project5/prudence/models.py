from django.db import models
from django.contrib.auth import get_user_model
from decimal import Decimal

User = get_user_model()

PROBABILITY_CHOICES = [
    (1, 'Very Low'),
    (2, 'Low'),
    (3, 'Moderate'),
    (4, 'High'),
    (5, 'Very High'),
]

IMPACT_CHOICES = [
    (1, 'Very Low'),
    (2, 'Low'),
    (3, 'Moderate'),
    (4, 'High'),
    (5, 'Very High'),
]

class RiskType(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.name

class Control(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    EFFECTIVENESS_CHOICES = [
        (0.0, 'Not Effective'),
        (0.5, 'Partially Effective'),
        (1.0, 'Fully Effective'),
    ]
    effectiveness = models.FloatField(choices=EFFECTIVENESS_CHOICES, default=0.0)
    owner = models.ForeignKey(User, related_name='controls', on_delete=models.SET_NULL, null=True)
    clastassessed = models.DateField(auto_now=True)

    def __str__(self):
        return self.name

class Action(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    effectiveness = models.DecimalField(max_digits=3, decimal_places=2)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='actions')

    def __str__(self):
        return self.name

class Risk(models.Model):
    description = models.TextField()
    inherent_probability = models.IntegerField(choices=PROBABILITY_CHOICES)
    inherent_impact = models.IntegerField(choices=IMPACT_CHOICES)
    inherent_risk_rating = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    controls = models.ManyToManyField(Control, blank=True)
    residual_impact = models.IntegerField(choices=IMPACT_CHOICES, null=True, blank=True)
    residual_probability = models.IntegerField(choices=PROBABILITY_CHOICES, null=True, blank=True)
    residual_risk_rating = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    risk_owner = models.ForeignKey(User, related_name='risks_owned', on_delete=models.SET_NULL, null=True)
    last_assessed = models.DateField(auto_now=True)

    def save(self, *args, **kwargs):
        # Calculate the inherent risk rating if not already set
        if not self.inherent_risk_rating:
            self.inherent_risk_rating = Decimal(self.inherent_probability * self.inherent_impact).quantize(Decimal('0.01'))
        
        # Calculate residual risk rating as the product of residual impact and residual probability
        if self.residual_impact is not None and self.residual_probability is not None:
            self.residual_risk_rating = Decimal(self.residual_impact * self.residual_probability).quantize(Decimal('0.01'))
        else:
            self.residual_risk_rating = None

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.description} - {self.risk_owner.username if self.risk_owner else 'No owner'}"