# Deployment Guide for AskAI Health Project

## Architecture

- **Frontend**: Deployed on Vercel (React + Vite)
- **Backend**: Deployed on Google Cloud Run (Node.js + Express)

## Backend Deployment (Google Cloud)

### Prerequisites

1. Google Cloud CLI installed and authenticated
2. Google Cloud project: `healthmoodapp`
3. Service account key file in `backend/` directory

### Environment Variables for Backend

- `NODE_ENV`: `production`
- `PORT`: `8000`
- `FRONTEND_ORIGIN`: Your Vercel frontend URL
- `PROJECT_ID`: `healthmoodapp`
- `FIRESTORE_ENABLED`: `true`
- `NEWSAPI_KEY`: Your News API key
- `OPENWEATHER_API_KEY`: Your OpenWeather API key

### Deploy Backend

```bash
cd backend
./deploy.sh
```

This will:

1. Build Docker container
2. Push to Google Container Registry
3. Deploy to Cloud Run
4. Provide the backend URL

## Frontend Deployment (Vercel)

### Environment Variables for Frontend

- `VITE_API_BASE`: Your Google Cloud backend URL (e.g., `https://askai-health-backend-xxx.run.app`)

### Deploy Frontend

1. Connect GitHub repository to Vercel
2. Set environment variable `VITE_API_BASE` to your backend URL
3. Deploy automatically on push to main branch

## API Endpoints

The backend will be available at your Google Cloud URL:

- `https://your-backend-url.run.app/api/checkin` - Check-in functionality
- `https://your-backend-url.run.app/api/weather` - Weather data
- `https://your-backend-url.run.app/api/news` - News data
- `https://your-backend-url.run.app/api/flashcard` - Flashcard functionality
- `https://your-backend-url.run.app/api/dailytip` - Daily health tips
- `https://your-backend-url.run.app/api/feedback` - Feedback submission
- `https://your-backend-url.run.app/api/mood_trends` - Mood trends
- `https://your-backend-url.run.app/api/summarize` - Text summarization
