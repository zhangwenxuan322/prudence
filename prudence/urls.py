# prudence/urls.py

from django.contrib import admin
from django.urls import path, include
from accounts import views as accounts_views
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', accounts_views.home, name='home'),  
    path('accounts/', include('accounts.urls')), 
    path('add-risk/', views.add_risk, name='add_risk'),
    path('add-control/', views.add_control, name='add_control'),
    path('risks/', views.risk_list, name='risk_list'),  
    path('controls/', views.control_list, name='control_list'),
    path('edit-risk/<int:risk_id>/', views.edit_risk, name='edit_risk'),
    path('delete-risk/<int:risk_id>/', views.delete_risk, name='delete_risk'),
    path('assess-risk/<int:assessment_id>/', views.assess_risk, name='assess_risk'),
    path('edit-control/<int:control_id>/', views.edit_control, name='edit_control'),
    path('delete-control/<int:control_id>/', views.delete_control, name='delete_control'),
    path('assigned-items/', views.assigned_items, name='assigned_items'),
    path('risk-register/', views.risk_register, name='risk_register'),
]