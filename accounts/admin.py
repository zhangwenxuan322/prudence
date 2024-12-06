from django.contrib import admin

from prudence.models import RiskType, Control, Action, Risk, RiskAssessment
from .models import CustomUser

# Register your models here.
admin.site.register(CustomUser)
admin.site.register(RiskType)
admin.site.register(Control)
admin.site.register(Action)
admin.site.register(Risk)
admin.site.register(RiskAssessment)
