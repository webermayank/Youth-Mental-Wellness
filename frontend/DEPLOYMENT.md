# Frontend Deployment Guide

## Vercel Deployment

### 1. Environment Variables

Set these environment variables in your Vercel dashboard:

```
VITE_API_BASE=https://askai-health-backend-358309174344.asia-south1.run.app
```

### 2. Build Configuration

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node.js Version**: 18.x

### 3. Deployment Steps

1. **Connect to Vercel**:

   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `frontend` folder as the root directory

2. **Set Environment Variables**:

   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add `VITE_API_BASE` with the backend URL

3. **Deploy**:
   - Vercel will automatically build and deploy
   - The app will be available at `https://your-project.vercel.app`

### 4. Backend Integration

The frontend is configured to:

- Use production backend URL in production builds
- Fall back to localhost for development
- Handle CORS properly with the backend

### 5. API Endpoints

The frontend connects to these backend endpoints:

- `/api/summarize` - Mood analysis and text summarization
- `/api/checkin` - User check-ins
- `/api/weather` - Weather data
- `/api/news` - News articles
- `/api/flashcard/*` - Flashcard functionality
- `/api/dailytip` - Daily health tips
- `/api/feedback` - User feedback
- `/api/mood_trends` - Mood trend analysis

### 6. Troubleshooting

If you encounter CORS issues:

1. Check that the backend is running
2. Verify the backend URL is correct
3. Check browser console for specific error messages

### 7. Local Development

To run locally:

```bash
npm run dev
```

The app will use `http://localhost:8000` as the backend URL automatically.
