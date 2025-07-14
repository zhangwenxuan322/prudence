from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.api_views import register_view, login_view, current_user_view, logout_view
from prudence.api_views import (
    RiskViewSet, ControlViewSet, RiskAssessmentViewSet, 
    RiskTypeViewSet, ActionViewSet, UserViewSet, dashboard_stats
)

# Create router for viewsets
router = DefaultRouter()
router.register(r'risks', RiskViewSet, basename='risk')
router.register(r'controls', ControlViewSet, basename='control')
router.register(r'risk-assessments', RiskAssessmentViewSet, basename='risk-assessment')
router.register(r'risk-types', RiskTypeViewSet, basename='risk-type')
router.register(r'actions', ActionViewSet, basename='action')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', register_view, name='register'),
    path('auth/login/', login_view, name='login'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/user/', current_user_view, name='current-user'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    
    # Dashboard endpoint
    path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),
    
    # Include router URLs
    path('', include(router.urls)),
]