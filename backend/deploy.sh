#!/bin/bash

# Google Cloud deployment script for AskAI Health Backend

# Set variables
PROJECT_ID="healthmoodapp"
SERVICE_NAME="askai-health-backend"
REGION="us-central1"

echo "🚀 Starting deployment to Google Cloud..."

# Set the project
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "📋 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build and deploy using Cloud Build
echo "🔨 Building and deploying with Cloud Build..."
gcloud builds submit --config cloudbuild.yaml .

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")

echo "✅ Deployment completed!"
echo "🌐 Backend URL: $SERVICE_URL"
echo "📝 Update your frontend VITE_API_BASE to: $SERVICE_URL"
