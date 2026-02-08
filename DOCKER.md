# Docker Setup

Production-ready Docker configuration for the BookShop application with optimized builds, multi-stage Dockerfiles, and comprehensive orchestration.

## Quick Start

### Development Mode
```bash
docker compose -f docker-compose.dev.yml up
```
- Client: http://localhost:3000
- Server: http://localhost:5000
- MongoDB Express: http://localhost:8081 (admin/pass)

### Production Mode
```bash
docker compose up -d
```
- Application: http://localhost
- MongoDB Express: http://localhost:8081 (admin/pass)

## Environment Variables

Create a `.env` file in the root directory:
```env
MONGO_URI=mongodb://mongo:27017/BookShopDB
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Docker Commands

### Build Images
```bash
# Development
docker compose -f docker-compose.dev.yml build

# Production
docker compose build
```

### Start Services
```bash
# Development with logs
docker compose -f docker-compose.dev.yml up

# Production in background
docker compose up -d
```

### Stop Services
```bash
docker compose down

# Remove volumes
docker compose down -v
```

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f server
```

### Execute Commands
```bash
# Server shell
docker compose exec server sh

# Import data
docker compose exec server npm run data:import
```

## Architecture

### Multi-Stage Builds
- **Development**: Hot-reload with volume mounts
- **Production**: Optimized images with nginx serving static files

### Services
- **mongo**: MongoDB 8.0 with persistent volumes
- **mongo-express**: Web UI for MongoDB
- **server**: Node.js backend API
- **client**: React frontend (nginx in production)

### Networks
All services communicate through isolated bridge networks.

### Volumes
- `mongo_data`: Persistent MongoDB data
- `mongo_config`: MongoDB configuration

## Best Practices Applied

✓ Multi-stage builds for minimal image sizes
✓ Layer caching optimization
✓ Non-root user for production
✓ Health checks for service dependencies
✓ .dockerignore for faster builds
✓ Named volumes for data persistence
✓ Security headers in nginx
✓ Gzip compression enabled
