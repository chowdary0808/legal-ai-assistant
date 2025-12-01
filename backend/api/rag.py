"""
RAG System for Legal Q&A Chatbot
ALL RAG LOGIC IN ONE FILE

Components:
1. Sentence Transformers for embeddings (FREE, local)
2. ChromaDB for vector storage (persistent)
3. ChatGroq for answer generation
"""

import os
from typing import List, Dict
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings
from groq import Groq

# Load environment variables
load_dotenv()

# ===========================
# INITIALIZE MODELS & CLIENTS
# ===========================

# SentenceTransformer for embeddings (384 dimensions, fast, FREE)
print("Loading SentenceTransformer model...")
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
print("SentenceTransformer model loaded successfully!")

# ChromaDB client (persistent mode)
print("Initializing ChromaDB...")
chroma_client = chromadb.PersistentClient(
    path="./chroma_db",
    settings=Settings(
        anonymized_telemetry=False  # Disable telemetry
    )
)

# Get or create collection
collection = chroma_client.get_or_create_collection(
    name="legal_faqs",
    metadata={"description": "Legal FAQ embeddings for RAG"}
)
print(f"ChromaDB initialized! Collection 'legal_faqs' ready.")

# Groq client for LLM
groq_client = Groq(api_key=os.getenv('GROQ_API_KEY'))


def get_embedding(text: str) -> List[float]:
    """
    Generate embedding vector for text using SentenceTransformer.

    Args:
        text: Input text string

    Returns:
        List of floats representing the embedding vector (384 dimensions)
    """
    embedding = embedding_model.encode(text)
    return embedding.tolist()


def add_faq_to_chroma(faq_id: int, question: str, answer: str, category: str) -> None:
    """
    Add FAQ to ChromaDB collection.

    Args:
        faq_id: Unique identifier for the FAQ
        question: The question text
        answer: The answer text
        category: Legal category (e.g., "Employment Law")
    """
    try:
        # Generate embedding for the question
        embedding = get_embedding(question)

        # Add to ChromaDB
        collection.add(
            ids=[str(faq_id)],
            embeddings=[embedding],
            documents=[question],
            metadatas=[{
                "question": question,
                "answer": answer,
                "category": category
            }]
        )
        print(f"Added FAQ {faq_id} to ChromaDB: {question[:50]}...")
    except Exception as e:
        print(f"Error adding FAQ {faq_id} to ChromaDB: {e}")


def search_similar_faqs(question: str, top_k: int = 2) -> List[Dict]:
    """
    Search for similar FAQs using semantic similarity.

    Args:
        question: User's question
        top_k: Number of top results to return (default: 2)

    Returns:
        List of dicts with: id, question, answer, category, similarity_score
    """
    try:
        # Generate embedding for user question
        query_embedding = get_embedding(question)

        # Query ChromaDB
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )

        # Format results
        formatted_results = []
        if results and results['ids'] and len(results['ids'][0]) > 0:
            for i in range(len(results['ids'][0])):
                # Convert distance to similarity score (1 - distance)
                # ChromaDB returns L2 distance, convert to similarity percentage
                distance = results['distances'][0][i]
                similarity = max(0, 1 - distance)  # Ensure non-negative

                formatted_results.append({
                    'id': results['ids'][0][i],
                    'question': results['metadatas'][0][i]['question'],
                    'answer': results['metadatas'][0][i]['answer'],
                    'category': results['metadatas'][0][i]['category'],
                    'similarity_score': round(similarity * 100, 2)  # Convert to percentage
                })

        return formatted_results
    except Exception as e:
        print(f"Error searching FAQs: {e}")
        return []


def generate_answer(question: str, sources: List[Dict]) -> str:
    """
    Generate AI answer using ChatGroq based on retrieved sources.

    Args:
        question: User's question
        sources: List of relevant FAQ sources

    Returns:
        AI-generated answer text
    """
    try:
        # Build context from sources
        context = ""
        for idx, source in enumerate(sources, 1):
            context += f"\n[Source {idx} - {source['category']}]\n"
            context += f"Q: {source['question']}\n"
            context += f"A: {source['answer']}\n"

        # Create prompt
        prompt = f"""You are a helpful legal assistant. Answer the user's question based on the following context from our legal FAQ database.

Provide a clear, accurate, and helpful answer. If the context doesn't fully answer the question, do your best to provide useful information while noting any limitations.

Context:
{context}

User Question: {question}

Answer:"""

        # Call Groq API
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful legal assistant that provides accurate information based on the given context. Always be clear, concise, and helpful."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=500
        )

        answer = chat_completion.choices[0].message.content
        return answer.strip()

    except Exception as e:
        print(f"Error generating answer: {e}")
        return f"I apologize, but I encountered an error generating an answer. Please try again. Error: {str(e)}"


def process_question(question: str) -> Dict:
    """
    Main RAG pipeline: retrieve sources and generate answer.

    Args:
        question: User's question

    Returns:
        Dict with 'answer' and 'sources' keys
    """
    try:
        # Step 1: Search for similar FAQs
        sources = search_similar_faqs(question, top_k=2)

        if not sources:
            return {
                'answer': "I apologize, but I couldn't find relevant information in our FAQ database. Please try rephrasing your question or contact a legal professional for assistance.",
                'sources': []
            }

        # Step 2: Generate answer using sources
        answer = generate_answer(question, sources)

        return {
            'answer': answer,
            'sources': sources
        }

    except Exception as e:
        print(f"Error processing question: {e}")
        return {
            'answer': f"An error occurred while processing your question: {str(e)}",
            'sources': []
        }




def get_collection_count() -> int:
    """Get count of documents in ChromaDB collection."""
    try:
        return collection.count()
    except:
        return 0


def clear_collection() -> None:
    """Clear all documents from ChromaDB collection (use with caution!)."""
    try:
        # Delete and recreate collection
        chroma_client.delete_collection(name="legal_faqs")
        global collection
        collection = chroma_client.create_collection(
            name="legal_faqs",
            metadata={"description": "Legal FAQ embeddings for RAG"}
        )
        print("Collection cleared successfully!")
    except Exception as e:
        print(f"Error clearing collection: {e}")


if __name__ == "__main__":
    # Test the RAG system
    print("\n" + "="*50)
    print("Testing RAG System")
    print("="*50 + "\n")

    # Test embedding generation
    test_text = "What is the statute of limitations?"
    embedding = get_embedding(test_text)
    print(f"Generated embedding for '{test_text}'")
    print(f"Embedding dimensions: {len(embedding)}")
    print(f"First 5 values: {embedding[:5]}\n")

    # Test ChromaDB count
    count = get_collection_count()
    print(f"Current FAQs in ChromaDB: {count}\n")

    print("RAG system initialized successfully!")
