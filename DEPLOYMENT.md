# Deployment Pipeline

Comprehensive CI/CD pipeline for the BookShop application with support for multiple deployment targets.

## Overview

The pipeline includes:
- **CI**: Automated testing, building, and security scanning
- **CD**: Multiple deployment options (Docker Hub, AWS ECS, Kubernetes)
- **Security**: Vulnerability scanning with Trivy
- **Multi-platform**: Supports linux/amd64 and linux/arm64

## Workflows

### 1. CI - Test and Build (`.github/workflows/ci.yml`)

Runs on every push and pull request to `main` and `develop` branches.

**Jobs:**
- `test-server`: Tests backend with MongoDB
- `test-client`: Tests frontend and creates production build
- `build-images`: Builds Docker images (push events only)
- `security-scan`: Scans for vulnerabilities with Trivy

### 2. CD - Docker Hub (`.github/workflows/cd-dockerhub.yml`)

Deploys to Docker Hub on push to `main` or version tags.

**Features:**
- Multi-platform builds (amd64, arm64)
- Automatic tagging (latest, semver, sha)
- Docker Hub description updates

**Required Secrets:**
- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Docker Hub access token

### 3. CD - AWS ECS (`.github/workflows/cd-aws-ecs.yml`)

Deploys to AWS Elastic Container Service.

**Features:**
- Pushes to Amazon ECR
- Updates ECS task definition
- Zero-downtime deployment
- Waits for service stability

**Required Secrets:**
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key

**Required Setup:**
- ECR repositories: `bookshop-server`, `bookshop-client`
- ECS cluster: `bookshop-cluster`
- ECS service: `bookshop-service`
- Secrets Manager: Cloudinary credentials

### 4. CD - Kubernetes (`.github/workflows/cd-kubernetes.yml`)

Deploys to Kubernetes cluster.

**Features:**
- Pushes to GitHub Container Registry (GHCR)
- Rolling updates with kubectl
- Automatic rollout verification

**Required Secrets:**
- `KUBE_CONFIG`: Base64-encoded kubeconfig file

## Setup Instructions

### 1. GitHub Secrets

Add these secrets to your repository (Settings → Secrets and variables → Actions):

#### For Docker Hub:
```
DOCKERHUB_USERNAME=your-dockerhub-username
DOCKERHUB_TOKEN=your-dockerhub-token
```

#### For AWS ECS:
```
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
```

#### For Kubernetes:
```
KUBE_CONFIG=base64-encoded-kubeconfig
```

To encode kubeconfig:
```bash
cat ~/.kube/config | base64 -w 0
```

### 2. Docker Hub Setup

1. Create Docker Hub account
2. Create access token: Account Settings → Security → New Access Token
3. Create repositories: `bookshop-server` and `bookshop-client`

### 3. AWS ECS Setup

#### Create ECR Repositories:
```bash
aws ecr create-repository --repository-name bookshop-server --region us-east-1
aws ecr create-repository --repository-name bookshop-client --region us-east-1
```

#### Store Secrets in AWS Secrets Manager:
```bash
aws secretsmanager create-secret \
  --name bookshop/cloudinary \
  --secret-string '{
    "cloud_name":"your_cloud_name",
    "api_key":"your_api_key",
    "api_secret":"your_api_secret"
  }' \
  --region us-east-1
```

#### Update Task Definition:
Edit `.aws/task-definition.json` and replace:
- `ACCOUNT_ID` with your AWS account ID
- Update region if not using `us-east-1`

#### Create ECS Cluster and Service:
```bash
# Create cluster
aws ecs create-cluster --cluster-name bookshop-cluster

# Create service (after first deployment)
aws ecs create-service \
  --cluster bookshop-cluster \
  --service-name bookshop-service \
  --task-definition bookshop-task \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

### 4. Kubernetes Setup

#### Deploy to Kubernetes:
```bash
# Update image repositories in k8s/deployment.yml
# Replace 'your-username' with your GitHub username

# Apply configurations
kubectl apply -f k8s/deployment.yml
kubectl apply -f k8s/ingress.yml

# Verify deployment
kubectl get all -n bookshop
```

#### Update Secrets:
```bash
kubectl create secret generic bookshop-secrets \
  --from-literal=cloudinary-cloud-name=your_cloud_name \
  --from-literal=cloudinary-api-key=your_api_key \
  --from-literal=cloudinary-api-secret=your_api_secret \
  -n bookshop
```

## Deployment Targets Comparison

| Feature | Docker Hub | AWS ECS | Kubernetes |
|---------|-----------|---------|------------|
| Complexity | Low | Medium | High |
| Scalability | Manual | Auto | Auto |
| Cost | Free (public) | Pay per use | Varies |
| Best For | Distribution | AWS users | Complex apps |

## Usage

### Trigger Deployments

#### Docker Hub:
```bash
# Push to main branch
git push origin main

# Or create a version tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

#### AWS ECS:
```bash
# Push to main branch
git push origin main

# Or manually trigger
# Go to Actions → CD - Deploy to AWS ECS → Run workflow
```

#### Kubernetes:
```bash
# Push to main branch
git push origin main

# Or manually trigger
# Go to Actions → CD - Deploy to Kubernetes → Run workflow
```

### Monitor Deployments

1. Go to your repository on GitHub
2. Click "Actions" tab
3. Select the workflow run
4. View logs for each job

### Rollback

#### Docker Hub:
Pull a previous image version:
```bash
docker pull youruser/bookshop-server:v1.0.0
```

#### AWS ECS:
```bash
# List task definitions
aws ecs list-task-definitions --family-prefix bookshop-task

# Update service to previous revision
aws ecs update-service \
  --cluster bookshop-cluster \
  --service bookshop-service \
  --task-definition bookshop-task:REVISION_NUMBER
```

#### Kubernetes:
```bash
# Rollback deployment
kubectl rollout undo deployment/bookshop-server -n bookshop
kubectl rollout undo deployment/bookshop-client -n bookshop

# Or to specific revision
kubectl rollout undo deployment/bookshop-server --to-revision=2 -n bookshop
```

## Environment Variables

### Production Environment Variables

Set these in your deployment platform:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb://mongo:27017/BookShopDB
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Kubernetes Secrets

Already configured in `k8s/deployment.yml` - just update values:
```bash
kubectl edit secret bookshop-secrets -n bookshop
```

## Monitoring

### Health Checks

All deployments include health checks:
- Server: HTTP GET to port 5000
- Client: HTTP GET to port 80
- MongoDB: mongosh ping command

### Logs

#### AWS ECS:
```bash
aws logs tail /ecs/bookshop --follow
```

#### Kubernetes:
```bash
kubectl logs -f deployment/bookshop-server -n bookshop
kubectl logs -f deployment/bookshop-client -n bookshop
```

## Troubleshooting

### Build Failures

1. Check workflow logs in GitHub Actions
2. Verify Dockerfile syntax
3. Ensure all dependencies are in package.json
4. Check node_modules caching

### Deployment Failures

#### Docker Hub:
- Verify Docker Hub credentials
- Check repository permissions
- Ensure repository exists

#### AWS ECS:
- Verify AWS credentials
- Check ECR repository exists
- Ensure ECS cluster is running
- Verify task definition is valid
- Check Secrets Manager permissions

#### Kubernetes:
- Verify kubeconfig is valid
- Check cluster connectivity
- Ensure namespace exists
- Verify image pull permissions

### Security Scan Failures

If Trivy finds vulnerabilities:
1. Review the security report in GitHub Security tab
2. Update dependencies: `npm audit fix`
3. Update base images to latest versions
4. Consider using distroless images for production

## Best Practices

1. **Never commit secrets** - Use environment variables and secrets managers
2. **Tag releases** - Use semantic versioning (v1.0.0, v1.1.0, etc.)
3. **Test locally** - Build and test Docker images before pushing
4. **Monitor resources** - Set up CloudWatch/Prometheus alerts
5. **Regular updates** - Keep dependencies and base images updated
6. **Backup data** - Regular MongoDB backups
7. **Use staging** - Test in staging environment before production

## Cost Optimization

### AWS ECS:
- Use Fargate Spot for non-critical workloads
- Enable container insights selectively
- Use ARM64 architecture (Graviton)
- Set appropriate CPU/memory limits

### Kubernetes:
- Use node auto-scaling
- Set resource requests/limits
- Use spot/preemptible instances
- Enable cluster auto-scaler

## Next Steps

1. Set up staging environment
2. Add performance testing to CI
3. Implement blue-green deployments
4. Add database migration automation
5. Set up monitoring and alerting
6. Configure CDN for static assets
7. Implement backup automation

## Support

For issues:
1. Check GitHub Actions logs
2. Review deployment platform logs
3. Verify all secrets are set correctly
4. Check network connectivity
5. Review resource quotas
