FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy web package files (rename package-web.json to package.json)
COPY package-web.json ./package.json
COPY package-lock.json ./

# Install dependencies
RUN npm install --production

# Copy application files (web version)
COPY server.js ./
COPY web-renderer.js ./
COPY index.html ./
COPY web.html ./
COPY compose/ ./compose/
COPY *.md ./
COPY *.sh ./

# Create non-root user
RUN addgroup -g 1001 -S automafy && \
    adduser -S automafy -u 1001

# Change ownership
RUN chown -R automafy:automafy /app
USER automafy

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["node", "server.js"]