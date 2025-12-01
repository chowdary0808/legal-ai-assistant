"""
URL routing for API endpoints.
"""

from django.urls import path
from . import views

urlpatterns = [
    path('ask/', views.ask_question, name='ask_question'),
    path('health/', views.health_check, name='health_check'),
    path('stats/', views.get_stats, name='get_stats'),
    path('logs/', views.get_logs, name='get_logs'),
]
