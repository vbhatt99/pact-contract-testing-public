# PACT Contract Testing Framework

> **⚠️ IMPORTANT DISCLAIMER**: This repository is for **educational and testing purposes only**. It provides examples and guidance for learning PACT contract testing concepts. Users are responsible for their own implementation, security, compliance, and production use. See [LICENSE](LICENSE) and [DISCLAIMER](DISCLAIMER.md) for full terms.

A comprehensive, production-ready PACT-based contract testing framework that covers everything from basic examples to advanced scenarios including bi-directional contracts and performance testing.

## 🎯 Purpose

This framework is designed to:
- **Educate** developers on PACT contract testing concepts
- **Demonstrate** best practices and patterns
- **Provide** working examples for learning
- **Guide** implementation of contract testing in real projects

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm (comes with Node.js)
- Git (for version control)
- curl (for API testing)
- jq (for JSON processing)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd pact-contract-testing

# Install dependencies
npm install
```

### Run Tests
```bash
# Single test (simple example)
npm run test:single         # 1 consumer test suite (3 tests)

# Consumer tests only
npm run test:consumer       # All consumer tests (3 suites, 11 tests)

# Provider tests only  
npm run test:provider       # All provider tests (⚠️ has port conflicts when run together)

# All contract tests (recommended)
npm run test:contract       # Consumer + Provider tests (⚠️ provider tests may have port conflicts)

# Setup and cleanup
npm run setup               # Create test directories
npm run cleanup             # Clean test artifacts
```

> **⚠️ Note**: `npm run test` runs ALL tests including advanced ones that have issues. Use `npm run test:contract` for complete contract testing.

## 📋 All Available Commands

### Test Commands
```bash
npm run test                 # Run all tests (⚠️ includes broken advanced tests)
npm run test:single          # Single test example ✅ (1 suite, 3 tests)
npm run test:consumer        # Consumer tests only ✅ (3 suites, 11 tests)
npm run test:provider        # Provider tests only (⚠️ has port conflicts when run together)
npm run test:contract        # All contract tests (⚠️ provider tests may have port conflicts)
```

### Setup & Cleanup
```bash
npm run setup                # Create test directories
npm run cleanup              # Clean test artifacts
```

## 🧪 Test Execution Guide

### Step 1: Environment Setup
```bash
# Create necessary directories and files
npm run setup
```

**What this does:**
- Creates `logs/` directory for test logs
- Creates `pacts/` directory for PACT contract files
- Ensures clean environment for testing

### Step 2: Consumer Tests (PACT Generation)
```bash
# Run consumer tests to generate PACT contracts
npm run test:single
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

### Step 3: Provider Verification Tests
```bash
# Run provider verification tests
npm run test:provider
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
```

### Step 4: Complete Test Suite
```bash
# Run both consumer and provider tests
npm run test:contract
```

**What this does:**
- Runs consumer tests (generates contracts)
- Runs provider verification tests
- Provides complete test coverage

### Step 5: Cleanup (Optional)
```bash
# Clean up test artifacts
npm run cleanup
```

**What this does:**
- Removes generated log files
- Removes PACT contract files
- Resets environment for next test run

## 🎯 Common Test Scenarios

### Scenario 1: First Time Setup
```bash
npm install
npm run setup
npm run test:contract
```

### Scenario 2: Development Testing
```bash
npm run test:single
npm run test:consumer
npm run test:provider
```

### Scenario 3: Debugging Issues
```bash
npm run cleanup
npm run setup
npm run test:single
```

## 📊 Test Results & Status

### ✅ Working Commands
| Command | Status | Results | Best For |
|---------|--------|---------|----------|
| `npm run test:single` | ✅ **PASS** | 1 suite, 3 tests | Learning & beginners |
| `npm run test:consumer` | ✅ **PASS** | 3 suites, 11 tests | Consumer contract testing |
| `npm run setup` | ✅ **PASS** | Creates directories | Environment setup |
| `npm run cleanup` | ✅ **PASS** | Cleans artifacts | Cleanup after testing |

### ⚠️ Commands with Known Issues
| Command | Status | Issue | Workaround |
|---------|--------|-------|------------|
| `npm run test:provider` | ⚠️ **PARTIAL** | Port conflicts (1 passed, 2 failed) | Run individual provider tests |
| `npm run test:contract` | ⚠️ **PARTIAL** | Same port conflicts | Run consumer + individual provider tests |

### 🔧 Root Cause Analysis
**Port Conflicts**: Multiple provider tests try to start Express servers on port 3001 simultaneously, causing `EADDRINUSE` errors. This is a common issue in PACT testing when multiple provider verification tests run in parallel.

### 🎯 Recommended Workflow
1. **Learning**: `npm run test:single` (perfect for beginners)
2. **Consumer Testing**: `npm run test:consumer` (all consumer tests work)
3. **Provider Testing**: Run individual provider tests separately
4. **Complete Testing**: Run consumer tests first, then individual provider tests

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Port Already in Use (Provider Tests)
**Error:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Root Cause:** Multiple provider tests try to start servers on port 3001 simultaneously.

**Solution:**
```bash
# Kill any running processes on port 3001
lsof -ti:3001 | xargs kill -9

# Or kill all node processes
pkill -f node

# Then run individual tests instead of all provider tests
npm run test:single
# or
npm run test:consumer
```

**Prevention:** Avoid running `npm run test:provider` or `npm run test:contract` - use individual tests instead.

#### 2. PACT Mock Server Issues
**Error:**
```
Pact mock server failed to start
```

**Solution:**
```bash
# Clean up and restart
npm run cleanup
npm run setup
npm run test:single
```

#### 3. Provider Tests Failing with Port Conflicts
**Error:**
```
Test Suites: 2 failed, 1 passed, 3 total
listen EADDRINUSE: address already in use :::3001
```

**Root Cause:** Multiple provider verification tests try to start Express servers on the same port simultaneously.

**Solution:**
```bash
# Don't run all provider tests together - use individual tests
npm run test:consumer  # This works perfectly

# For provider testing, run individual tests:
jest examples/provider/__tests__/simpleUserService.verification.test.js
jest examples/provider/__tests__/userService.verification.test.js
jest examples/provider/__tests__/productService.verification.test.js
```

**Why this happens:** The `npm run test:provider` command runs all provider tests in parallel, causing port conflicts. Individual tests work fine.

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

#### 5. Advanced Tests Failing
**Error:**
```
npm run test fails with many test failures
```

**Solution:**
```bash
# Use the complete contract test suite
npm run test:contract

# Or run individual working tests
npm run test:consumer
npm run test:provider
```

**Why this happens:** The `npm run test` command runs ALL tests including advanced examples that have API compatibility issues. The basic tests work perfectly.

### Emergency Commands

#### Reset Everything
```bash
npm run cleanup
pkill -f node
rm -rf node_modules package-lock.json
npm install
npm run setup
```

#### Quick Health Check
```bash
curl -f http://localhost:3001/health || echo "Provider not running"
npm run security:audit
```

## 📊 Test Results Interpretation

### ✅ Success Indicators
```
✓ should return a list of users
✓ should return a specific user
✓ should return 404 when user does not exist
Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

### ❌ Failure Indicators
```
✗ should return a list of users
Expected: 1, Received: 2
Test Suites: 1 failed, 1 total
Tests:       2 passed, 1 failed
```

### 🔍 Verification Success
```
Verifying a pact between UserServiceConsumer and UserServiceProvider
  a request for all users
    returns a response which
      has status code 200 (OK)
      includes headers "Content-Type" with value "application/json" (OK)
      has a matching body (OK)
```

## 🐳 Docker Usage (Optional)

While this framework doesn't include Docker implementation, you can containerize your PACT testing setup:

### Basic Docker Setup
```bash
# Example Dockerfile for consumer service
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "test:consumer"]

# Example docker-compose.yml
version: '3.8'
services:
  consumer:
    build: .
    environment:
      - PROVIDER_URL=http://provider:3001
  provider:
    build: ./provider
    ports:
      - "3001:3001"
  pact-broker:
    image: pactfoundation/pact-broker
    ports:
      - "9292:9292"
```

### Docker Best Practices for PACT
- Use multi-stage builds for smaller images
- Mount pact files as volumes for persistence
- Use health checks for service dependencies
- Consider using Docker Compose for local development

## 📁 Project Structure

```
pact-contract-testing/
├── examples/
│   ├── consumer/           # Consumer services and tests
│   ├── provider/           # Provider services and verification
│   ├── shared/             # Shared types and matchers
│   └── advanced/           # Advanced testing scenarios
├── docs/                   # Documentation
├── pacts/                  # Generated PACT files
├── logs/                   # Test logs
├── scripts/                # Test scripts
└── package.json           # Dependencies and scripts
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

## 🚀 Advanced Testing

### Performance Testing
```bash
# Run tests multiple times
for i in {1..5}; do
  echo "Run $i:"
  npm run ci:test
done
```

### Different Configurations
```bash
# Test with different provider URL
PROVIDER_URL=http://localhost:3002 npm run test:verification

# Test with different PACT broker
PACT_BROKER_BASE_URL=http://localhost:9292 npm run test:simple

# Test with verbose logging
LOG_LEVEL=DEBUG npm run ci:test
```

## 📚 Additional Resources

- [PACT Documentation](https://docs.pact.io/)
- [Consumer-Driven Contracts](https://martinfowler.com/articles/consumerDrivenContracts.html)
- [Microservices Testing](https://microservices.io/patterns/testing/service-contract-test.html)
- [API Design Best Practices](https://restfulapi.net/)

## ⚠️ Important Notes

- **Testing Only**: This is a demonstration framework, not production-ready code
- **User Responsibility**: All security, compliance, and production considerations are the user's responsibility
- **No Warranty**: Provided "as-is" without any warranties or guarantees
- **Educational Use**: Intended for learning and development purposes only

## 🆘 Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review the test output for specific error messages
3. Ensure all prerequisites are installed
4. Verify ports are not in use
5. Check the generated PACT files for contract mismatches

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- PACT Foundation for the excellent tooling
- The microservices community for best practices
- Contributors and maintainers

---

**Happy Testing! 🧪✨**