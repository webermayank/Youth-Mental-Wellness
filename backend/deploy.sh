#!/bin/bash

# Backend Deployment Script for Google Cloud Run
# This script builds and deploys the backend service

set -e

# Configuration
PROJECT_ID="healthmoodapp"
SERVICE_NAME="askai-health-backend"
REGION="asia-south1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Starting backend deployment..."

# Set the project
echo "📋 Setting project to $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Build the image
echo "🔨 Building Docker image..."
gcloud builds submit --tag $IMAGE_NAME

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8000 \
  --set-env-vars ML_SERVICE_URL=https://ml-service-358309174344.asia-south1.run.app,NODE_ENV=production,FRONTEND_ORIGIN=https://youth-mental-wellness.vercel.app,FIRESTORE_ENABLED=false

echo "✅ Backend deployment completed!"
echo "🌐 Service URL: https://$SERVICE_NAME-$(gcloud config get-value project | tr ':' '-').$REGION.run.app"