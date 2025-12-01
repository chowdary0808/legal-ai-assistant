# Quick Setup Guide

Follow these steps to get the Legal Q&A Chatbot running in minutes.

## Prerequisites

Before starting, ensure you have:

- [ ] Python 3.8 or higher installed
- [ ] Node.js 16 or higher installed
- [ ] Groq API key (get free at https://console.groq.com)

## Step 1: Get Groq API Key

1. Visit https://console.groq.com
2. Sign up for a free account
3. Navigate to API Keys section
4. Click "Create API Key"
5. Copy the key (you'll need it in Step 3)

## Step 2: Backend Setup

Open a terminal and run:

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install Python dependencies (this may take 2-3 minutes)
pip install -r requirements.txt
```

## Step 3: Configure Backend Environment

### Option A: Auto-Generate .env File (Recommended)

Run this command in the `backend` folder:

```bash
python -c "import secrets; key=''.join(secrets.choice('abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)') for i in range(50)); print(f'GROQ_API_KEY=your_groq_api_key_here\nDJANGO_SECRET_KEY={key}')" > .env
```

Then edit the `.env` file and replace `your_groq_api_key_here` with your actual Groq API key.

### Option B: Manual Creation

Create a file named `.env` in the `backend` folder with:

```env
GROQ_API_KEY=paste_your_groq_api_key_here
DJANGO_SECRET_KEY=django-insecure-dev-key-for-development-only
```

**Important:** Replace `paste_your_groq_api_key_here` with your actual Groq API key!

**Note:** For production, generate a strong secret key using:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## Step 4: Initialize Database

```bash
# Still in backend folder with venv activated

# Create database tables
python manage.py makemigrations
python manage.py migrate

# Load the 15 legal FAQs (this will download AI models on first run)
python data/load_faqs.py
```

**Note:** First run will download the sentence-transformers model (~90MB). This is normal and only happens once.

You should see output like:
```
Loading SentenceTransformer model...
ChromaDB initialized!
✓ [1/15] Loaded: Civil Law - What is the statute of limitations...
...
✓ All FAQs loaded successfully!
Database FAQs: 15
ChromaDB FAQs: 15
```

## Step 5: Start Backend Server

```bash
# Start Django server
python manage.py runserver
```

Keep this terminal open. You should see:
```
Starting development server at http://127.0.0.1:8000/
```

## Step 6: Frontend Setup

Open a **NEW terminal** (keep backend running) and run:

```bash
# Navigate to frontend folder
cd frontend

# Install Node dependencies (this may take 1-2 minutes)
npm install
```

## Step 7: Configure Frontend Environment

Create a file named `.env` in the `frontend` folder with:

```env
VITE_API_URL=http://localhost:8000/api
```

## Step 8: Start Frontend Server

```bash
# Start React development server
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Step 9: Open Application

1. Open your browser
2. Go to: http://localhost:5173
3. You should see the Legal AI Assistant welcome screen
4. Try asking: "How do I file for a trademark?"

## Verification Checklist

Make sure everything works:

- [ ] Backend running at http://localhost:8000
- [ ] Frontend running at http://localhost:5173
- [ ] Can access the chat interface
- [ ] Dark mode toggle works
- [ ] Can send a question and get a response
- [ ] Source cards appear with answers
- [ ] No console errors

## Common Issues

### Issue: "Module not found" errors

**Solution:**
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

### Issue: "Port 8000 already in use"

**Solution:**
```bash
# Use different port
python manage.py runserver 8001

# Update frontend/.env
VITE_API_URL=http://localhost:8001/api
```

### Issue: "GROQ_API_KEY not found"

**Solution:**
- Check `.env` file exists in `backend` folder
- Verify API key is correctly pasted
- No spaces or quotes around the key

### Issue: "CORS error" in browser console

**Solution:**
- Ensure backend is running
- Check `django-cors-headers` is installed
- Restart backend server

### Issue: Frontend shows "Unable to connect to server"

**Solution:**
- Verify backend is running (check terminal)
- Check `VITE_API_URL` in `frontend/.env`
- Try accessing http://localhost:8000/api/health/ in browser

## Next Steps

Once everything is running:

1. **Try example questions** - Click the suggestion pills
2. **Test dark mode** - Click sun/moon icon in header
3. **Explore sources** - Click to expand source cards
4. **Clear chat** - Use the "Clear Chat" button
5. **Check documentation** - Read the READMEs for more details

## Development Tips

### Backend Development

```bash
# View logs
python manage.py runserver

# Access Django shell
python manage.py shell

# Create new migrations
python manage.py makemigrations

# Test RAG system directly
python -c "from api import rag; print(rag.process_question('test'))"
```

### Frontend Development

```bash
# Development mode (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Stopping the Application

1. In backend terminal: Press `Ctrl+C`
2. In frontend terminal: Press `Ctrl+C`
3. Deactivate virtual environment: `deactivate`

## Restarting Later

**Backend:**
```bash
cd backend
venv\Scripts\activate  # or source venv/bin/activate
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm run dev
```


