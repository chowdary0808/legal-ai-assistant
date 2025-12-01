"""
Data Loading Script for Legal FAQs
Loads FAQs from JSON into both Django database and ChromaDB.
"""

import os
import sys
import json
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'legal_qa.settings')
django.setup()

from api.models import FAQ
from api import rag


def load_faqs():
    """Load FAQs from JSON file into database and ChromaDB."""

    # Get path to JSON file
    json_path = os.path.join(os.path.dirname(__file__), 'legal_faqs.json')

    print("\n" + "="*60)
    print("LOADING LEGAL FAQs")
    print("="*60 + "\n")

    # Load JSON data
    print(f"Reading FAQs from: {json_path}")
    with open(json_path, 'r', encoding='utf-8') as f:
        faqs_data = json.load(f)

    print(f"Found {len(faqs_data)} FAQs to load\n")

    # Clear existing FAQs
    print("Clearing existing FAQs from database...")
    FAQ.objects.all().delete()
    print("Database cleared!\n")

    # Note: ChromaDB collection is persistent, you may want to clear it too
    # Uncomment the next line if you want to clear ChromaDB
    # rag.clear_collection()

    # Load each FAQ
    loaded_count = 0
    for faq_data in faqs_data:
        try:
            # Create Django model instance
            faq = FAQ.objects.create(
                question=faq_data['question'],
                answer=faq_data['answer'],
                category=faq_data['category']
            )

            # Add to ChromaDB using the database ID
            rag.add_faq_to_chroma(
                faq_id=faq.id,
                question=faq_data['question'],
                answer=faq_data['answer'],
                category=faq_data['category']
            )

            loaded_count += 1
            print(f"✓ [{loaded_count}/{len(faqs_data)}] Loaded: {faq_data['category']} - {faq_data['question'][:60]}...")

        except Exception as e:
            print(f"✗ Error loading FAQ ID {faq_data['id']}: {e}")

    # Verify loading
    print("\n" + "="*60)
    print("LOADING COMPLETE!")
    print("="*60)
    print(f"\nDatabase FAQs: {FAQ.objects.count()}")
    print(f"ChromaDB FAQs: {rag.get_collection_count()}")

    # Show category breakdown
    print("\nFAQs by Category:")
    from django.db.models import Count
    categories = FAQ.objects.values('category').annotate(count=Count('category')).order_by('-count')
    for cat in categories:
        print(f"  - {cat['category']}: {cat['count']}")

    print("\n✓ All FAQs loaded successfully!")
    print("\nYou can now start the Django server and test the RAG system.\n")


if __name__ == "__main__":
    load_faqs()
