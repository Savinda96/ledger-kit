# LedgerKit Production Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY src/ ./src/

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S ledgerkit && \
    adduser -S ledgerkit -u 1001

# Copy built application
COPY --from=builder --chown=ledgerkit:ledgerkit /app/dist ./dist
COPY --from=builder --chown=ledgerkit:ledgerkit /app/node_modules ./node_modules
COPY --chown=ledgerkit:ledgerkit package*.json ./

# Switch to non-root user
USER ledgerkit

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the application
CMD ["node", "dist/index.js"]