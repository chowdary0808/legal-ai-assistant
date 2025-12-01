"""
URL configuration for legal_qa project.
"""

from django.urls import path, include

urlpatterns = [
    path('api/', include('api.urls')),
]
