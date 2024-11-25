# accounts/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register, name='register'),
    path('risks/', views.risk_list, name='risk_list'),
    path('controls/', views.control_list, name='control_list'),
    path('risk-register/', views.risk_register, name='risk_register'),
]
