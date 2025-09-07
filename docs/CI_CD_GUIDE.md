# CI/CD Integration Guide

> **⚠️ IMPORTANT DISCLAIMER**: This guide is for **educational and testing purposes only**. The CI/CD configurations and examples provided are demonstrations and should not be used in production without proper security review, compliance validation, and customization for your specific environment. Users are responsible for their own implementation, security, compliance, and production use.

This guide covers integrating PACT contract testing into your CI/CD pipeline for automated, reliable contract validation.

## 🚀 Overview

A well-integrated CI/CD pipeline ensures:
- **Automated Testing**: Contracts are tested on every change
- **Early Detection**: Breaking changes are caught before deployment
- **Contract Sharing**: Teams can share and validate contracts
- **Deployment Safety**: Only compatible changes are deployed

## 🔧 GitHub Actions Setup

### Basic Workflow

```yaml
# .github/workflows/pact-ci.yml
name: PACT Contract Testing CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  consumer-tests:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run consumer tests
      run: npm run test:consumer
      env:
        PACT_BROKER_BASE_URL: ${{ secrets.PACT_BROKER_BASE_URL }}
        PACT_BROKER_TOKEN: ${{ secrets.PACT_BROKER_TOKEN }}
    
    - name: Publish PACTs
      run: npm run pact:publish
      env:
        PACT_BROKER_BASE_URL: ${{ secrets.PACT_BROKER_BASE_URL }}
        PACT_BROKER_TOKEN: ${{ secrets.PACT_BROKER_TOKEN }}
      if: github.ref == 'refs/heads/main'
```

### Provider Verification

```yaml
  provider-tests:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Start provider server
      run: |
        npm run start:provider &
        sleep 10
      env:
        PORT: 3001
    
    - name: Run provider verification
      run: npm run test:provider
      env:
        PACT_BROKER_BASE_URL: ${{ secrets.PACT_BROKER_BASE_URL }}
        PACT_BROKER_TOKEN: ${{ secrets.PACT_BROKER_TOKEN }}
    
    - name: Publish verification results
      run: |
        pact-broker publish-verification-results \
          --provider-base-url=http://localhost:3001 \
          --broker-base-url=${{ secrets.PACT_BROKER_BASE_URL }} \
          --broker-token=${{ secrets.PACT_BROKER_TOKEN }} \
          --provider-app-version=${{ github.sha }} \
          --verification-results=pacts/verification-results.json
      if: github.ref == 'refs/heads/main'
```

## 🔐 Secrets Configuration

### Required Secrets

> **⚠️ SECURITY WARNING**: The examples below show placeholder values. In production, you must:
> - Use strong, unique secrets
> - Implement proper secret rotation
> - Use secure secret management systems
> - Follow your organization's security policies
> - Never commit real secrets to version control

Set these secrets in your GitHub repository:

```bash
# PACT Broker Configuration
PACT_BROKER_BASE_URL=https://your-pact-broker.com
PACT_BROKER_TOKEN=your-pact-broker-token

# Optional: Additional configuration
PACT_BROKER_USERNAME=your-username
PACT_BROKER_PASSWORD=your-password
```

**⚠️ Security Responsibilities:**
- Implement proper secret management
- Use environment-specific configurations
- Enable secret scanning in your repositories
- Regularly rotate secrets and tokens
- Monitor for secret exposure

### Setting Up Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add the required secrets:
   - `PACT_BROKER_BASE_URL`
   - `PACT_BROKER_TOKEN`

## 🐳 Docker Integration

### Dockerfile for Provider

```dockerfile
# Dockerfile.provider
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY examples/provider/ ./examples/provider/
COPY examples/shared/ ./examples/shared/

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["node", "examples/provider/server.js"]
```

### Docker Compose for Local Development

```yaml
# docker-compose.yml
version: '3.8'

services:
  pact-broker:
    image: pactfoundation/pact-broker:latest
    ports:
      - "9292:9292"
    environment:
      PACT_BROKER_DATABASE_URL: postgres://pact_broker:password@postgres:5432/pact_broker
      PACT_BROKER_BASIC_AUTH_USERNAME: pact
      PACT_BROKER_BASIC_AUTH_PASSWORD: pact
    depends_on:
      - postgres

  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: pact_broker
      POSTGRES_USER: pact_broker
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  provider:
    build:
      context: .
      dockerfile: Dockerfile.provider
    ports:
      - "3001:3001"
    depends_on:
      - pact-broker

volumes:
  postgres_data:
```

## 📊 Contract Validation Pipeline

### Breaking Change Detection

```yaml
  contract-validation:
    runs-on: ubuntu-latest
    needs: [consumer-tests, provider-tests]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Check for breaking changes
      run: |
        pact-broker can-i-deploy \
          --pacticipant=UserServiceProvider \
          --version=${{ github.sha }} \
          --to=production \
          --broker-base-url=${{ secrets.PACT_BROKER_BASE_URL }} \
          --broker-token=${{ secrets.PACT_BROKER_TOKEN }}
    
    - name: Generate compatibility matrix
      run: |
        pact-broker matrix \
          --pacticipant=UserServiceProvider \
          --version=${{ github.sha }} \
          --broker-base-url=${{ secrets.PACT_BROKER_BASE_URL }} \
          --broker-token=${{ secrets.PACT_BROKER_TOKEN }} \
          --output=json > compatibility-matrix.json
    
    - name: Upload compatibility report
      uses: actions/upload-artifact@v3
      with:
        name: compatibility-matrix
        path: compatibility-matrix.json
```

## 🔒 Security Integration

### Dependency Scanning

```yaml
  security-scan:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run security audit
      run: npm audit --audit-level=moderate
    
    - name: Run dependency check
      run: npm run audit:fix || true
    
    - name: Check for vulnerabilities
      run: |
        if npm audit --audit-level=high; then
          echo "No high-severity vulnerabilities found"
        else
          echo "High-severity vulnerabilities found"
          exit 1
        fi
```

### Secret Scanning

```yaml
  secret-scan:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Run secret scanning
      uses: trufflesecurity/trufflehog@main
      with:
        path: ./
        base: main
        head: HEAD
        extra_args: --debug --only-verified
```

## 🧪 Integration Testing

### End-to-End Testing

```yaml
  integration-tests:
    runs-on: ubuntu-latest
    needs: [consumer-tests, provider-tests]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Start services
      run: |
        docker-compose up -d
        sleep 30
    
    - name: Wait for services to be ready
      run: |
        until curl -f http://localhost:3001/health; do
          echo "Waiting for provider..."
          sleep 5
        done
        
        until curl -f http://localhost:9292; do
          echo "Waiting for PACT broker..."
          sleep 5
        done
    
    - name: Run integration tests
      run: npm run test:integration
      env:
        PROVIDER_URL: http://localhost:3001
        PACT_BROKER_URL: http://localhost:9292
    
    - name: Cleanup
      run: docker-compose down
      if: always()
```

## 📈 Monitoring and Alerting

### Test Results Monitoring

```yaml
  monitoring:
    runs-on: ubuntu-latest
    needs: [consumer-tests, provider-tests, contract-validation]
    if: always()
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Send notification
      run: |
        if [ "${{ needs.consumer-tests.result }}" == "failure" ]; then
          echo "Consumer tests failed"
          # Send alert to Slack/Teams/etc.
        fi
        
        if [ "${{ needs.provider-tests.result }}" == "failure" ]; then
          echo "Provider verification failed"
          # Send alert to Slack/Teams/etc.
        fi
        
        if [ "${{ needs.contract-validation.result }}" == "failure" ]; then
          echo "Contract validation failed"
          # Send alert to Slack/Teams/etc.
        fi
```

### Performance Monitoring

```yaml
  performance-monitoring:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run performance tests
      run: npm run test:performance
    
    - name: Upload performance results
      uses: actions/upload-artifact@v3
      with:
        name: performance-results
        path: performance-results.json
```

## 🚀 Deployment Strategies

### Blue-Green Deployment

```yaml
  blue-green-deployment:
    runs-on: ubuntu-latest
    needs: [contract-validation]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to staging
      run: |
        # Deploy to staging environment
        kubectl apply -f k8s/staging/
    
    - name: Run staging tests
      run: |
        # Run tests against staging
        npm run test:staging
    
    - name: Deploy to production
      run: |
        # Deploy to production
        kubectl apply -f k8s/production/
      if: github.ref == 'refs/heads/main'
```

### Canary Deployment

```yaml
  canary-deployment:
    runs-on: ubuntu-latest
    needs: [contract-validation]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy canary
      run: |
        # Deploy canary version
        kubectl apply -f k8s/canary/
    
    - name: Monitor canary
      run: |
        # Monitor canary for 10 minutes
        sleep 600
        
        # Check metrics
        if [ "$(check-metrics)" == "healthy" ]; then
          echo "Canary is healthy, promoting to production"
          kubectl apply -f k8s/production/
        else
          echo "Canary is unhealthy, rolling back"
          kubectl rollout undo deployment/user-service
        fi
```

## 📋 Best Practices

### 1. Pipeline Design
- **Fast Feedback**: Keep tests fast and focused
- **Parallel Execution**: Run independent tests in parallel
- **Fail Fast**: Stop on first failure when appropriate
- **Clear Reporting**: Provide clear test results and logs

### 2. Contract Management
- **Version Control**: Track contract versions
- **Breaking Changes**: Detect and handle breaking changes
- **Compatibility**: Ensure backward compatibility
- **Documentation**: Document contract changes

### 3. Security
- **Secret Management**: Use secure secret storage
- **Access Control**: Limit access to sensitive resources
- **Audit Logging**: Log all pipeline activities
- **Vulnerability Scanning**: Regular security scans

### 4. Monitoring
- **Test Metrics**: Track test performance and success rates
- **Alerting**: Set up alerts for failures
- **Dashboards**: Create visibility into pipeline health
- **Trends**: Monitor trends over time

## 🚨 Troubleshooting

### Common Issues

1. **PACT Broker Connection**
   ```bash
   # Test connectivity
   curl -H "Authorization: Bearer $PACT_BROKER_TOKEN" \
        $PACT_BROKER_BASE_URL
   ```

2. **Provider Not Ready**
   ```bash
   # Wait for provider
   until curl -f http://localhost:3001/health; do
     echo "Waiting for provider..."
     sleep 5
   done
   ```

3. **Contract Verification Failures**
   ```bash
   # Check verification results
   pact-broker verification-results \
     --provider=UserServiceProvider \
     --version=1.0.0 \
     --broker-base-url=$PACT_BROKER_BASE_URL
   ```

### Debugging Tips

- **Enable Debug Logging**: Set `PACT_LOG_LEVEL=DEBUG`
- **Check PACT Files**: Review generated PACT files
- **Monitor Resources**: Check CPU and memory usage
- **Review Logs**: Check application and test logs

## 📚 Next Steps

1. **Set up your PACT Broker** for contract sharing
2. **Configure your CI/CD pipeline** with the provided templates
3. **Add monitoring and alerting** for better visibility
4. **Implement deployment strategies** for safe releases
5. **Regular maintenance** and updates

## 🆘 Getting Help

- Check the [PACT documentation](https://docs.pact.io/)
- Review the GitHub Actions logs
- Consult the troubleshooting guide
- Open an issue for bugs or questions

Happy CI/CD integration! 🚀
