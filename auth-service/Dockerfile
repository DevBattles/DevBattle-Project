# ===========================================
# DevBattle Auth Service - Production Dockerfile
# ===========================================

# Stage 1: Install dependencies
FROM node:20-alpine AS deps

WORKDIR /app

# Install build tools for native modules (bcrypt, etc.)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Production image
FROM node:20-alpine AS production

WORKDIR /app

# Security: run as non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S appuser -u 1001

# Copy dependencies and source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Remove dev dependencies
RUN npm prune --production

# Create logs directory
RUN mkdir -p logs && chown -R appuser:nodejs /app

# Set ownership
USER appuser

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); })" || exit 1

# Start the application
CMD ["node", "src/server.js"]
