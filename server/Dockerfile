# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app

# Development stage
FROM base AS development
ENV NODE_ENV=development
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]

# Build stage for production dependencies
FROM base AS deps
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev && \
    npm cache clean --force

# Production stage
FROM node:20-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=node:node . .
RUN apk add --no-cache dumb-init
USER node
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "index.js"]
