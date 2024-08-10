from django import forms
from .models import Risk, Control, PROBABILITY_CHOICES, IMPACT_CHOICES

class RiskForm(forms.ModelForm):
    class Meta:
        model = Risk
        fields = [
            'description',
            'inherent_probability',
            'inherent_impact',
            'controls',
            'residual_probability',
            'residual_impact',
            'risk_owner',
        ]
        widgets = {
            'inherent_probability': forms.Select(choices=PROBABILITY_CHOICES),
            'inherent_impact': forms.Select(choices=IMPACT_CHOICES),
            'residual_probability': forms.Select(choices=PROBABILITY_CHOICES),
            'residual_impact': forms.Select(choices=IMPACT_CHOICES),
        }

class ControlForm(forms.ModelForm):
    class Meta:
        model = Control
        fields = [
            'name', 
            'description', 
            'effectiveness', 
            'owner',
            ]
        widgets = {
            'effectiveness': forms.Select(choices=Control.EFFECTIVENESS_CHOICES),
            'description': forms.Textarea(attrs={'rows': 3}),
        }