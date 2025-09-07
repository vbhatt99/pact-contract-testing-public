# GitHub Actions Setup Guide

> **⚠️ IMPORTANT DISCLAIMER**: This guide is for **educational and testing purposes only**. The GitHub Actions configurations provided are demonstrations and should not be used in production without proper security review, compliance validation, and customization for your specific environment. Users are responsible for their own implementation, security, compliance, and production use.

## 🚀 Overview

This repository includes comprehensive GitHub Actions workflows for PACT contract testing that demonstrate:

- **Automated Testing**: Consumer and provider tests on every push
- **Weekly Scheduled Runs**: Comprehensive testing every Sunday night
- **Security Scanning**: Regular security audits and compliance checks
- **Docker Integration**: Container building and deployment workflows
- **PACT Broker Integration**: Contract management and sharing

## 📅 Schedule Configuration

### Main CI/CD Pipeline
- **Triggers**:
  - Every push to `main` or `develop` branches
  - Pull requests to `main` branch
  - **Weekly on Sunday at 11:00 PM UTC**
  - Manual triggering via GitHub UI

### Security Scan
- **Triggers**:
  - Every push to `main` branch
  - Pull requests to `main` branch
  - **Weekly on Sunday at 11:00 PM UTC** (same as main CI)
  - Manual triggering via GitHub UI

## 🔧 Workflow Files

### 1. Main CI/CD Pipeline (`.github/workflows/pact-ci.yml`)

**Purpose**: Complete PACT contract testing pipeline

**Jobs**:
- `consumer-tests`: Generate PACT contracts from consumer tests
- `provider-tests`: Verify provider against generated contracts
- `contract-validation`: Validate contract compatibility
- `security-scan`: Security audit and vulnerability check
- `integration-tests`: End-to-end integration testing
- `pact-broker`: Publish contracts to PACT Broker (if configured)
- `deployment-check`: Final deployment readiness check

**Matrix Strategy**: Tests on Node.js 18.x and 20.x

### 2. Security Scan (`.github/workflows/security-scan.yml`)

**Purpose**: Comprehensive security and compliance scanning

**Jobs**:
- `security-audit`: npm audit and vulnerability scanning
- `dependency-check`: Check for outdated and unused dependencies
- `code-quality`: ESLint and code formatting checks
- `compliance-check`: Sensitive data and permission validation

### 3. PACT Broker Integration (`.github/workflows/pact-broker.yml`)

**Purpose**: Manual PACT Broker operations

**Features**:
- Check broker status
- Publish PACT files
- Verify contracts
- Check deployment readiness

### 4. Docker Build and Deploy (`.github/workflows/docker-build.yml`)

**Purpose**: Container building and deployment

**Jobs**:
- `build-and-test`: Build and test Docker images
- `deploy-staging`: Deploy to staging environment
- `deploy-production`: Deploy to production (on tags)

## ⚙️ Configuration

### Required Secrets

Set these secrets in your GitHub repository settings:

```bash
# PACT Broker Configuration (Optional)
PACT_BROKER_BASE_URL=https://your-pact-broker.com
PACT_BROKER_TOKEN=your-pact-broker-token

# Additional secrets for production use
GITHUB_TOKEN=auto-provided-by-github
```

### Environment Variables

The workflows use these environment variables:

```yaml
# Default values (can be overridden)
PACT_BROKER_BASE_URL: http://localhost:9292
PORT: 3001
NODE_ENV: test
```

## 📊 Workflow Execution

### On Push to Main/Develop
1. **Consumer Tests**: Generate PACT contracts
2. **Provider Tests**: Verify contracts against provider
3. **Contract Validation**: Check compatibility
4. **Security Scan**: Audit dependencies and code
5. **Integration Tests**: End-to-end testing
6. **Deployment Check**: Verify readiness

### Weekly Sunday Night Run
1. **Full Test Suite**: All tests run with latest code
2. **Security Audit**: Comprehensive security scanning
3. **Dependency Check**: Check for outdated packages
4. **Compliance Check**: Validate security practices
5. **Report Generation**: Create summary reports

### On Pull Request
1. **Consumer Tests**: Generate contracts
2. **Provider Tests**: Verify contracts
3. **Security Scan**: Basic security checks
4. **Code Quality**: Linting and formatting

## 🎯 Key Features

### Matrix Testing
- Tests on multiple Node.js versions (18.x, 20.x)
- Ensures compatibility across environments
- Parallel execution for faster results

### Artifact Management
- PACT files uploaded as artifacts
- Test logs preserved for debugging
- Verification results stored
- 30-day retention for important artifacts

### Security Integration
- Automated vulnerability scanning
- Dependency audit on every run
- Sensitive data detection
- Compliance validation

### Docker Support
- Multi-stage builds for optimization
- Container testing and validation
- Staging and production deployment
- Image caching for performance

## 📈 Monitoring and Reporting

### GitHub Actions Dashboard
- View workflow runs and results
- Monitor test success rates
- Track performance metrics
- Debug failed runs

### Artifacts
- Download PACT files
- Review test logs
- Access verification results
- Get security audit reports

### Notifications
- Email notifications on failure
- Slack/Teams integration (configurable)
- GitHub status checks
- Deployment notifications

## 🔒 Security Considerations

### ⚠️ Security Responsibilities

**You are solely responsible for**:
- Implementing proper secret management
- Configuring secure environments
- Setting up access controls
- Ensuring compliance with regulations
- Monitoring and alerting setup

### Best Practices
- Use GitHub secrets for sensitive data
- Enable branch protection rules
- Require status checks for merging
- Regular security audits
- Monitor workflow permissions

## 🚨 Troubleshooting

### Common Issues

1. **Workflow Not Triggering**
   ```bash
   # Check workflow syntax
   # Verify branch names match
   # Check cron schedule format
   ```

2. **Tests Failing**
   ```bash
   # Check logs in Actions tab
   # Verify dependencies are installed
   # Check environment variables
   ```

3. **PACT Broker Connection**
   ```bash
   # Verify broker URL and token
   # Check network connectivity
   # Validate broker configuration
   ```

### Debug Steps
1. Check workflow logs in GitHub Actions
2. Review artifact contents
3. Test locally with same environment
4. Verify secrets are properly set
5. Check branch protection rules

## 📚 Customization

### Modifying Schedule
```yaml
# Change to different day/time
schedule:
  - cron: '0 2 * * 1'  # Monday at 2 AM UTC
  - cron: '0 9 * * 5'  # Friday at 9 AM UTC
```

### Adding New Jobs
```yaml
jobs:
  new-job:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    - name: Your step
      run: echo "Hello World"
```

### Environment-Specific Configuration
```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
    - name: Deploy
      run: echo "Deploying to production"
```

## 🎓 Learning Objectives

This GitHub Actions setup demonstrates:

1. **CI/CD Best Practices**: Automated testing and deployment
2. **PACT Integration**: Contract testing in CI/CD pipeline
3. **Security Scanning**: Automated security checks
4. **Docker Integration**: Container-based deployment
5. **Scheduled Workflows**: Regular maintenance tasks
6. **Artifact Management**: Storing and sharing test results
7. **Matrix Testing**: Multi-environment compatibility
8. **Environment Management**: Staging and production workflows

## 📞 Support

### Getting Help
- Check GitHub Actions documentation
- Review workflow logs and artifacts
- Consult the troubleshooting guide
- Test workflows locally first

### Best Practices
- Start with simple workflows
- Test changes in feature branches
- Use environment-specific configurations
- Monitor workflow performance
- Regular maintenance and updates

---

**Remember**: This is an educational framework. For production use, implement proper security, compliance, and operational procedures.

Happy CI/CD automation! 🚀
