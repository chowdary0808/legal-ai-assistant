#!/usr/bin/env python3
"""
Generate a secure Django secret key.
Run this script to generate a new secret key for your .env file.
"""

import secrets
import string

def generate_secret_key(length=50):
    """Generate a secure random secret key."""
    characters = string.ascii_letters + string.digits + '!@#$%^&*(-_=+)'
    return ''.join(secrets.choice(characters) for _ in range(length))

def generate_env_file():
    """Generate a complete .env file with a random secret key."""
    secret_key = generate_secret_key()

    env_content = f"""GROQ_API_KEY=your_groq_api_key_here
DJANGO_SECRET_KEY={secret_key}
"""

    print("="*60)
    print("DJANGO SECRET KEY GENERATOR")
    print("="*60)
    print("\nGenerated Secret Key:")
    print(secret_key)
    print("\n" + "="*60)
    print("\nComplete .env file content:")
    print("="*60)
    print(env_content)
    print("="*60)

    # Ask if user wants to save
    response = input("\nSave to .env file? (y/n): ").lower()
    if response == 'y':
        try:
            with open('.env', 'w') as f:
                f.write(env_content)
            print("✓ .env file created successfully!")
            print("\nNext step: Edit .env and replace 'your_groq_api_key_here' with your actual Groq API key.")
        except Exception as e:
            print(f"✗ Error creating .env file: {e}")
            print("\nPlease create .env manually with the content shown above.")
    else:
        print("\nCopy the content above and create .env manually.")

if __name__ == "__main__":
    generate_env_file()
