# Deployment Guide for AskAI Health Project

## Environment Variables Required

### Backend Environment Variables

- `NODE_ENV`: Set to `production`
- `PORT`: Set to `8000` (or let Vercel handle it)
- `FRONTEND_ORIGIN`: Your Vercel app URL (e.g., `https://your-app.vercel.app`)
- `PROJECT_ID`: Google Cloud Project ID (`askai-health-wellness`)
- `FIRESTORE_ENABLED`: Set to `true`
- `GOOGLE_APPLICATION_CREDENTIALS_JSON`: The entire contents of your service account JSON file as a string
- `NEWSAPI_KEY`: Your News API key
- `OPENWEATHER_API_KEY`: Your OpenWeather API key

### Frontend Environment Variables

- `VITE_API_BASE`: Your Vercel app URL with `/api` (e.g., `https://your-app.vercel.app/api`)

## Deployment Steps

1. Install Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`
3. Deploy: `vercel --prod`
4. Configure environment variables in Vercel dashboard
5. Redeploy if needed: `vercel --prod`

## Google Cloud Setup

Make sure your Google Cloud service account key file is properly configured:

- File: `backend/askai-health-wellness-firebase-adminsdk-fbsvc-223bd1f707.json`
- Project ID: `askai-health-wellness`

## API Endpoints

The backend will be available at `/api/*` routes:

- `/api/checkin` - Check-in functionality
- `/api/weather` - Weather data
- `/api/news` - News data
- `/api/flashcard` - Flashcard functionality
- `/api/dailytip` - Daily health tips
- `/api/feedback` - Feedback submission
- `/api/mood_trends` - Mood trends
- `/api/summarize` - Text summarization
