"""
Simple Django models for Legal Q&A chatbot.
Two models: FAQ and QueryLog.
"""

from django.db import models


class FAQ(models.Model):
    """
    Store legal FAQs for retrieval.
    Simple structure with question, answer, and category.
    """
    question = models.TextField()
    answer = models.TextField()
    category = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.category}: {self.question[:50]}..."

    class Meta:
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"


class QueryLog(models.Model):
    """
    Log all user queries with answers and sources.
    Track usage and performance.
    """
    question = models.TextField()
    answer = models.TextField()
    sources = models.JSONField()  # Store array of source FAQs
    processing_time = models.FloatField(null=True, blank=True)  # Time in seconds
    source_count = models.IntegerField(default=0)  # Number of sources retrieved
    avg_similarity = models.FloatField(null=True, blank=True)  # Average similarity score
    created_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)  # User IP
    user_agent = models.TextField(null=True, blank=True)  # Browser info

    def __str__(self):
        return f"Query at {self.created_at}: {self.question[:50]}..."

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Query Log"
        verbose_name_plural = "Query Logs"
