# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app

# Development stage
FROM base AS development
ENV NODE_ENV=development
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

# Build stage
FROM base AS builder
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install
COPY . .
RUN npm run build

# Production stage - serve with nginx
FROM nginx:1.27-alpine AS production
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
