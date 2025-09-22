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

# Copy Google Cloud service account key (if exists)
COPY askai-health-wellness-firebase-adminsdk-fbsvc-223bd1f707.json ./

# Copy health tips CSV file
COPY health_tips.csv ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 8000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8000
ENV ML_SERVICE_URL=https://ml-service-358309174344.asia-south1.run.app

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "src/index.js"]