"""
API Views for Legal Q&A Chatbot
Endpoints: ask, health, stats, logs
"""

import time
from django.db.models import Avg, Count
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import FAQ, QueryLog
from . import rag


def get_client_ip(request):
    """Extract client IP address from request."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


@api_view(['POST'])
def ask_question(request):
    """
    POST /api/ask/
    Process user question using RAG pipeline.

    Request body:
        {
            "question": "User's legal question"
        }

    Response:
        {
            "answer": "AI-generated answer",
            "sources": [
                {
                    "id": "1",
                    "question": "FAQ question",
                    "answer": "FAQ answer",
                    "category": "Legal category",
                    "similarity_score": 95.5
                }
            ],
            "processing_time": 1.23
        }
    """
    try:
        # Get question from request
        question = request.data.get('question', '').strip()

        # Validate input
        if not question:
            return Response(
                {'error': 'Question is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Start timer
        start_time = time.time()

        # Process question through RAG pipeline
        result = rag.process_question(question)

        # Calculate processing time
        processing_time = round(time.time() - start_time, 2)

        # Calculate average similarity score
        avg_similarity = None
        if result['sources']:
            avg_similarity = round(
                sum(s.get('similarity_score', 0) for s in result['sources']) / len(result['sources']),
                2
            )

        # Save to query log with enhanced metadata
        QueryLog.objects.create(
            question=question,
            answer=result['answer'],
            sources=result['sources'],
            processing_time=processing_time,
            source_count=len(result['sources']),
            avg_similarity=avg_similarity,
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:500]  # Limit to 500 chars
        )

        # Return response
        return Response({
            'answer': result['answer'],
            'sources': result['sources'],
            'processing_time': processing_time
        })

    except Exception as e:
        return Response(
            {'error': f'An error occurred: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def health_check(request):
    """
    GET /api/health/
    Check if API is running.

    Response:
        {
            "status": "ok",
            "message": "API is running"
        }
    """
    return Response({
        'status': 'ok',
        'message': 'API is running'
    })


@api_view(['GET'])
def get_stats(request):
    """
    GET /api/stats/
    Get system statistics.

    Response:
        {
            "total_faqs": 15,
            "total_queries": 42,
            "chroma_count": 15,
            "avg_processing_time": 1.23,
            "avg_similarity": 85.5
        }
    """
    try:
        # Query counts
        total_faqs = FAQ.objects.count()
        total_queries = QueryLog.objects.count()
        chroma_count = rag.get_collection_count()

        # Calculate averages
        stats = QueryLog.objects.aggregate(
            avg_processing_time=Avg('processing_time'),
            avg_similarity=Avg('avg_similarity')
        )

        return Response({
            'total_faqs': total_faqs,
            'total_queries': total_queries,
            'chroma_count': chroma_count,
            'avg_processing_time': round(stats['avg_processing_time'] or 0, 2),
            'avg_similarity': round(stats['avg_similarity'] or 0, 2)
        })

    except Exception as e:
        return Response(
            {'error': f'An error occurred: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_logs(request):
    """
    GET /api/logs/
    Get query logs with optional filtering.

    Query params:
        - limit: Number of logs to return (default: 50, max: 200)
        - offset: Pagination offset (default: 0)

    Response:
        {
            "count": 100,
            "logs": [
                {
                    "id": 1,
                    "question": "User question",
                    "answer": "AI answer",
                    "processing_time": 1.23,
                    "source_count": 2,
                    "avg_similarity": 85.5,
                    "created_at": "2024-01-01T12:00:00Z",
                    "ip_address": "127.0.0.1"
                }
            ]
        }
    """
    try:
        # Get query parameters
        limit = min(int(request.GET.get('limit', 50)), 200)
        offset = int(request.GET.get('offset', 0))

        # Get total count
        total_count = QueryLog.objects.count()

        # Get logs with pagination
        logs = QueryLog.objects.all()[offset:offset + limit]

        # Format logs
        formatted_logs = []
        for log in logs:
            formatted_logs.append({
                'id': log.id,
                'question': log.question,
                'answer': log.answer[:200] + '...' if len(log.answer) > 200 else log.answer,  # Truncate long answers
                'sources': log.sources,
                'processing_time': log.processing_time,
                'source_count': log.source_count,
                'avg_similarity': log.avg_similarity,
                'created_at': log.created_at.isoformat(),
                'ip_address': log.ip_address
            })

        return Response({
            'count': total_count,
            'limit': limit,
            'offset': offset,
            'logs': formatted_logs
        })

    except Exception as e:
        return Response(
            {'error': f'An error occurred: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
