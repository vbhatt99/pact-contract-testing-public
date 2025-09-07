# 🧪 PACT Contract Testing Framework - Test Execution Guide

This guide provides step-by-step instructions for running all tests in the PACT Contract Testing Framework.

## 📋 Prerequisites

Before running tests, ensure you have:

- ✅ Node.js (v18 or higher)
- ✅ npm (comes with Node.js)
- ✅ Git (for version control)
- ✅ curl (for API testing)
- ✅ jq (for JSON processing)

### Install Prerequisites (if needed)

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Install jq (macOS)
brew install jq

# Install jq (Ubuntu/Debian)
sudo apt-get install jq

# Install jq (Windows - via Chocolatey)
choco install jq
```

## 🚀 Quick Start - Run All Tests

For a complete test run, execute these commands in order:

```bash
# 1. Setup environment
npm run ci:setup

# 2. Run complete test suite
npm run ci:test

# 3. Run security audit
npm run security:audit

# 4. Cleanup (optional)
npm run ci:cleanup
```

## 📖 Detailed Test Execution Guide

### Step 1: Environment Setup

```bash
# Create necessary directories and files
npm run ci:setup
```

**What this does:**
- Creates `logs/` directory for test logs
- Creates `pacts/` directory for PACT contract files
- Ensures clean environment for testing

**Expected output:**
```
> pact-contract-testing@1.0.0 ci:setup
> mkdir -p logs pacts
```

### Step 2: Consumer Tests (PACT Generation)

```bash
# Run consumer tests to generate PACT contracts
npm run test:simple
```

**What this does:**
- Starts PACT mock server
- Runs consumer tests against mock server
- Generates PACT contract files
- Validates consumer expectations

**Expected output:**
```
✓ should return a list of users
✓ should return a specific user  
✓ should return 404 when user does not exist

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

**Generated files:**
- `pacts/UserServiceConsumer-UserServiceProvider.json`

### Step 3: Start Provider Server

```bash
# Start the provider server in background
npm run start:provider
```

**What this does:**
- Starts Express server on port 3001
- Provides REST API endpoints
- Enables CORS for testing
- Sets up health check endpoint

**Expected output:**
```
User Service Provider running on port 3001
Health check available at http://localhost:3001/health
```

**Verify server is running:**
```bash
# Check health endpoint
curl http://localhost:3001/health

# Expected response:
{"status":"healthy","timestamp":"2025-09-07T14:04:38.079Z"}
```

### Step 4: Provider Verification Tests

```bash
# Run provider verification tests
npm run test:verification
```

**What this does:**
- Reads generated PACT contracts
- Sends requests to running provider server
- Validates provider responses match contracts
- Reports verification results

**Expected output:**
```
Verifying a pact between UserServiceConsumer and UserServiceProvider

  a request for all users
    returns a response which
      has status code 200 (OK)
      includes headers "Content-Type" with value "application/json" (OK)
      has a matching body (OK)

  a request for non-existent user
    returns a response which
      has status code 404 (OK)
      includes headers "Content-Type" with value "application/json" (OK)
      has a matching body (OK)

  a request for user with id 1
    returns a response which
      has status code 200 (OK)
      includes headers "Content-Type" with value "application/json" (OK)
      has a matching body (OK)

✓ should verify the user service contracts
```

### Step 5: Complete CI Test Suite

```bash
# Run both consumer and provider tests
npm run ci:test
```

**What this does:**
- Runs consumer tests (generates contracts)
- Runs provider verification tests
- Provides complete test coverage
- Simulates CI/CD pipeline

**Expected output:**
```
> npm run test:simple && npm run test:verification

[Consumer tests output...]
[Provider verification output...]
```

### Step 6: Security Audit

```bash
# Check for security vulnerabilities
npm run security:audit
```

**What this does:**
- Scans all dependencies for vulnerabilities
- Reports security issues
- Ensures production readiness

**Expected output:**
```
found 0 vulnerabilities
```

### Step 7: API Endpoint Testing

```bash
# Test API endpoints manually
npm run health:check
```

**What this does:**
- Tests provider health endpoint
- Validates server responsiveness
- Ensures API is working correctly

**Manual API testing:**
```bash
# Get all users
curl http://localhost:3001/api/users | jq '.[0]'

# Get specific user
curl http://localhost:3001/api/users/1 | jq '.name'

# Test non-existent user
curl http://localhost:3001/api/users/999
```

### Step 8: Generate Test Reports

```bash
# Generate comprehensive test reports
npm run test:reports

# View latest report in browser
npm run reports:view

# List all available reports
npm run reports:list
```

**What this does:**
- Generates HTML, JSON, and Markdown reports
- Creates beautiful, interactive web reports
- Provides detailed test analysis and metrics
- Saves reports in the `reports/` directory

**Generated Report Types:**
- **HTML Report** - Interactive web report with charts and visualizations
- **JSON Report** - Machine-readable test data for CI/CD integration
- **Markdown Report** - Documentation-friendly format

### Step 9: Cleanup (Optional)

```bash
# Clean up test artifacts
npm run ci:cleanup
```

**What this does:**
- Removes generated log files
- Removes PACT contract files
- Resets environment for next test run

## 🔧 Individual Test Commands

### Consumer Tests

```bash
# Run all consumer tests
npm run test:consumer

# Run specific consumer test
npm run test:simple

# Run with verbose output
npm run test:consumer -- --verbose
```

### Provider Tests

```bash
# Run all provider tests
npm run test:provider

# Run specific provider verification
npm run test:verification

# Run with debug output
npm run test:provider -- --verbose
```

### Contract Tests

```bash
# Run contract-specific tests
npm run test:contract
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**
```bash
# Find process using port 3001
lsof -ti:3001

# Kill the process
kill -9 $(lsof -ti:3001)

# Or use different port
PORT=3002 npm run start:provider
```

#### 2. PACT Mock Server Issues

**Error:**
```
Pact mock server failed to start
```

**Solution:**
```bash
# Clean up and restart
npm run ci:cleanup
npm run ci:setup
npm run test:simple
```

#### 3. Provider Not Responding

**Error:**
```
Provider verification failed
```

**Solution:**
```bash
# Check if provider is running
curl http://localhost:3001/health

# Restart provider
npm run start:provider
```

#### 4. Missing Dependencies

**Error:**
```
Module not found
```

**Solution:**
```bash
# Install dependencies
npm install

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 5. PACT Contract Mismatch

**Error:**
```
Expected a List with 1 elements but received 2 elements
```

**Solution:**
```bash
# Check provider response
curl http://localhost:3001/api/users | jq 'length'

# Update consumer test to match provider
# Edit: examples/consumer/__tests__/simpleUserService.pact.test.js
```

## 📊 Test Results Interpretation

### Successful Test Run

```
✅ Consumer Tests: 3/3 passed
✅ Provider Verification: 3/3 passed  
✅ Security Audit: 0 vulnerabilities
✅ API Health: All endpoints working
✅ PACT Generation: Contracts created
```

### Failed Test Run

```
❌ Consumer Tests: 2/3 passed (1 failed)
❌ Provider Verification: 1/3 passed (2 failed)
❌ Security Audit: 3 vulnerabilities found
❌ API Health: Provider not responding
```

## 🔍 Understanding Test Output

### Consumer Test Output

```
✓ should return a list of users (14 ms)
✓ should return a specific user (3 ms)
✓ should return 404 when user does not exist (43 ms)
```

**What this means:**
- ✅ All consumer expectations met
- ✅ PACT contracts generated
- ✅ Mock server working correctly

### Provider Verification Output

```
Verifying a pact between UserServiceConsumer and UserServiceProvider
  a request for all users (0s loading, 432ms verification)
    returns a response which
      has status code 200 (OK)
      includes headers "Content-Type" with value "application/json" (OK)
      has a matching body (OK)
```

**What this means:**
- ✅ Provider matches consumer expectations
- ✅ API responses are correct
- ✅ Contracts are valid

### Security Audit Output

```
found 0 vulnerabilities
```

**What this means:**
- ✅ No security issues
- ✅ Dependencies are safe
- ✅ Ready for production

## 🚀 Advanced Testing

### Running Tests in Docker

```bash
# Build and test with Docker
docker-compose up --build

# Run specific service tests
docker-compose run consumer npm run test:simple
docker-compose run provider npm run test:verification
```

### Running Tests with Different Configurations

```bash
# Test with different provider URL
PROVIDER_URL=http://localhost:3002 npm run test:verification

# Test with different PACT broker
PACT_BROKER_BASE_URL=http://localhost:9292 npm run test:simple

# Test with verbose logging
LOG_LEVEL=DEBUG npm run ci:test
```

### Performance Testing

```bash
# Run tests multiple times
for i in {1..5}; do
  echo "Run $i:"
  npm run ci:test
done
```

## 📝 Test File Locations

```
examples/
├── consumer/
│   └── __tests__/
│       ├── simpleUserService.pact.test.js    # Simple consumer test
│       ├── userService.pact.test.js          # Full consumer test
│       └── productService.pact.test.js       # Product service test
├── provider/
│   └── __tests__/
│       ├── simpleUserService.verification.test.js  # Simple verification
│       ├── userService.verification.test.js        # Full verification
│       └── productService.verification.test.js     # Product verification
└── shared/
    └── matchers.js                           # PACT matchers
```

## 🎯 Next Steps

After running tests successfully:

1. **Explore the codebase** - Review test files and examples
2. **Modify tests** - Try changing expectations and see what happens
3. **Add new tests** - Create tests for new endpoints
4. **Run GitHub Actions** - Test CI/CD pipeline
5. **Experiment with Docker** - Test containerized deployment

## 📚 Additional Resources

- [PACT Documentation](https://docs.pact.io/)
- [Jest Testing Framework](https://jestjs.io/)
- [Express.js](https://expressjs.com/)
- [Docker Documentation](https://docs.docker.com/)

---

## ⚠️ Important Notes

- **Educational Purpose**: This framework is for learning and testing purposes only
- **User Responsibility**: Users are responsible for their own implementations
- **No Warranty**: No guarantee of production readiness
- **Security**: Always run security audits before production use

## 🆘 Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review the test output for specific error messages
3. Ensure all prerequisites are installed
4. Verify ports are not in use
5. Check the generated PACT files for contract mismatches

**Happy Testing! 🧪✨**
