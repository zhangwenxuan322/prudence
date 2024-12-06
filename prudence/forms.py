from django import forms
from .models import Risk, Control, RiskAssessment, PROBABILITY_CHOICES, IMPACT_CHOICES

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
            'assessor',
        ]
        widgets = {
            'inherent_probability': forms.Select(choices=PROBABILITY_CHOICES),
            'inherent_impact': forms.Select(choices=IMPACT_CHOICES),
            'residual_probability': forms.Select(choices=PROBABILITY_CHOICES),
            'residual_impact': forms.Select(choices=IMPACT_CHOICES),
        }
    
    def __init__(self, *args, **kwargs):
        super(RiskForm, self).__init__(*args, **kwargs)
        self.fields['assessor'].required = False

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

class RiskAssessmentForm(forms.ModelForm):
    class Meta:
        model = RiskAssessment
        fields = [
            'risk',
            'assessment_status',
            'assessor',
            'assessor_comments',
        ]
    
    def __init__(self, *args, **kwargs):
        super(RiskAssessmentForm, self).__init__(*args, **kwargs)
        self.fields['risk'].disabled = True
        self.fields['assessment_status'].required = True
        self.fields['assessor'].disabled = True
        self.fields['assessor_comments'].required = False