# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# Copy Google Cloud service account key
COPY askai-health-wellness-firebase-adminsdk-fbsvc-223bd1f707.json ./

# Expose port
EXPOSE 8000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8000

# Start the application
CMD ["node", "src/index.js"]