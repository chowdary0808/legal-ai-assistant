"""
Basic tests for Legal Q&A API
Run with: python manage.py test
"""

from django.test import TestCase
from rest_framework.test import APIClient
from .models import FAQ, QueryLog


class APITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create test FAQ
        FAQ.objects.create(
            question="What is a test question?",
            answer="This is a test answer.",
            category="Test Category"
        )

    def test_health_check(self):
        """Test health check endpoint"""
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'ok')

    def test_stats_endpoint(self):
        """Test stats endpoint"""
        response = self.client.get('/api/stats/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('total_faqs', response.json())

    def test_faq_model(self):
        """Test FAQ model"""
        faq = FAQ.objects.first()
        self.assertIsNotNone(faq)
        self.assertEqual(faq.category, "Test Category")

    # Note: Commenting out ask endpoint test as it requires ChromaDB setup
    # def test_ask_endpoint(self):
    #     """Test ask endpoint"""
    #     response = self.client.post('/api/ask/', {
    #         'question': 'What is a test question?'
    #     }, format='json')
    #     self.assertEqual(response.status_code, 200)
    #     self.assertIn('answer', response.json())
