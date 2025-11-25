# -----------------------------
# Stage 1: Builder (Alpine for consistency)
# -----------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY tsconfig.json ./
COPY src ./src

# Increase memory for TypeScript compiler
ENV NODE_OPTIONS="--max-old-space-size=1024"

# Build TypeScript → dist
RUN npm run build

# -----------------------------
# Stage 2: Production (Alpine)
# -----------------------------
FROM node:20-alpine AS production

# Set production environment
ENV NODE_ENV=production

WORKDIR /app

# Add production user (non-root for security)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy only package files for production install
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy built JS code from builder stage
COPY --from=builder /app/dist ./dist

# Create log directory and fix permissions
RUN mkdir -p logs && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["npm", "start"]