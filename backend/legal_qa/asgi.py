"""
ASGI config for legal_qa project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'legal_qa.settings')

application = get_asgi_application()
