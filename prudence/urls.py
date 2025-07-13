# prudence/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # API endpoints only - pure backend
    path('api/', include('api_urls')),
]