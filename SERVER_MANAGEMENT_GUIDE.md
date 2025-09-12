# 🚀 Server Management & Complete Test Suite Guide

> **⚠️ IMPORTANT DISCLAIMER**: This repository is for **educational and testing purposes only**. See [DISCLAIMER](DISCLAIMER.md) for full terms.

## 🎯 Overview

This guide covers the complete server management system and test suite that we've built for the PACT Contract Testing Framework. All tests now pass with automatic server management!

## ✅ What's New

### 🚀 Complete Server Management System
- **Automatic Server Startup/Shutdown** - No more manual server management
- **Port Conflict Resolution** - All port conflicts have been fixed
- **Health Checks** - Automatic server readiness verification
- **Graceful Cleanup** - Proper server shutdown after tests

### 🧪 Complete Test Suite (30+ Tests)
- **Consumer Tests** - 11 tests (PACT contract generation)
- **Provider Tests** - 3 tests (PACT contract verification)
- **Advanced Tests** - 16 tests (Integration & performance testing)
- **Total** - **30+ tests, all passing!**

## 🚀 Quick Start

### One-Command Testing (RECOMMENDED)
```bash
# Run the complete test suite with automatic server management
npm run test:ci
```

This single command:
1. ✅ Runs consumer tests (generates PACT contracts)
2. ✅ Starts required servers automatically
3. ✅ Runs provider tests (verifies contracts)
4. ✅ Runs advanced tests (integration & performance)
5. ✅ Stops all servers automatically
6. ✅ Provides comprehensive test results

## 📋 Available Commands

### Complete Test Suites
```bash
npm run test:ci              # Complete CI test suite (30+ tests) - RECOMMENDED
npm run test:with-servers    # Full test suite with server management
npm run test:full            # Alias for test:with-servers
```

### Individual Test Suites
```bash
npm run test:consumer        # Consumer tests only (11 tests)
npm run test:provider        # Provider tests only (3 tests)
npm run test:advanced        # Advanced tests only (16 tests)
npm run test:working         # Consumer + Provider tests (14 tests)
```

### Server Management
```bash
npm run start:servers        # Start servers manually for development
npm run start:provider       # Start provider server only
```

### Development Commands
```bash
npm run setup                # Create test directories
npm run cleanup              # Clean test artifacts
```

## 🔧 Server Management System

### Automatic Server Management
The framework now includes a complete server management system:

#### `scripts/start-servers.js`
- **Purpose**: Automatically starts all required servers for testing
- **Features**:
  - Health check verification
  - Graceful shutdown handling
  - Process management
  - Error handling and recovery

#### `scripts/run-ci-tests.js`
- **Purpose**: Complete CI test runner with server management
- **Features**:
  - Consumer test execution
  - Server startup and management
  - Provider test execution
  - Advanced test execution
  - Automatic cleanup

#### `scripts/run-tests-with-servers.js`
- **Purpose**: Full test suite with server management
- **Features**:
  - Complete test orchestration
  - Server lifecycle management
  - Comprehensive reporting

### Port Management
All port conflicts have been resolved:
- **User Service**: Port 3001
- **Product Service**: Port 3001 (same server)
- **Order Service**: Port 3001 (same server)
- **Advanced Tests**: Use existing servers

## 📊 Test Results

### Complete Test Suite Results
```
🎯 Starting CI Test Suite...

📋 Running Consumer Tests (Generate PACT Contracts)...
✅ Consumer tests passed (11 tests)

🚀 Starting Test Servers...
✅ Server started successfully on port 3001

🔍 Running Provider Tests (Verify PACT Contracts)...
✅ Provider tests passed (3 tests)

🧪 Running Advanced Tests (Integration & Performance)...
✅ Advanced tests passed (16 tests)

📊 Test Results Summary:
- Consumer Tests: ✅ 11/11 passed
- Provider Tests: ✅ 3/3 passed  
- Advanced Tests: ✅ 16/16 passed
- Total: ✅ 30+ tests passed
```

### Individual Test Results

#### Consumer Tests (11 tests)
- ✅ Simple User Service (3 tests)
- ✅ User Service (4 tests)
- ✅ Product Service (4 tests)

#### Provider Tests (3 tests)
- ✅ Simple User Service Verification
- ✅ User Service Verification
- ✅ Product Service Verification

#### Advanced Tests (16 tests)
- ✅ Performance Testing (8 tests)
- ✅ Bidirectional Contracts (8 tests)

## 🚀 GitHub Actions Integration

### Complete CI/CD Pipeline
The framework now includes a complete GitHub Actions pipeline:

#### `.github/workflows/pact-ci.yml`
- **Triggers**: Push to main, Pull requests
- **What it does**:
  - Runs complete test suite (30+ tests)
  - Generates PACT contracts
  - Verifies provider contracts
  - Runs integration tests
  - Manages servers automatically
- **Duration**: ~3-5 minutes
- **Artifacts**: PACT contracts, test reports, logs

#### `.github/workflows/pages.yml`
- **Triggers**: Push to main branch
- **What it does**: Publishes test reports to GitHub Pages
- **Features**: HTML reports, test history, performance metrics

### Setup Instructions
1. **Enable GitHub Pages**: Go to Settings > Pages, set Source to "GitHub Actions"
2. **Create Environment**: Go to Settings > Environments, create `github-pages` environment
3. **Push your code**: GitHub Actions will run automatically
4. **Check results**: View Actions tab and GitHub Pages for reports

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Server Already Running
**Error**: `Error: listen EADDRINUSE: address already in use :::3001`

**Solution**:
```bash
# Kill any running processes
pkill -f "node scripts/start-servers.js"
pkill -f "node examples/provider/server.js"

# Or use the complete test suite (handles this automatically)
npm run test:ci
```

#### 2. PACT Files Not Found
**Error**: `does not exist, or is not a file or directory`

**Solution**:
```bash
# Run consumer tests first to generate PACT files
npm run test:consumer

# Then run the complete suite
npm run test:ci
```

#### 3. Advanced Tests Failing
**Error**: `connect ECONNREFUSED`

**Solution**:
```bash
# Use the complete test suite (starts servers automatically)
npm run test:ci

# Or start servers manually first
npm run start:servers
npm run test:advanced
```

### Emergency Commands

#### Reset Everything
```bash
npm run cleanup
pkill -f node
rm -rf node_modules package-lock.json
npm install
npm run setup
npm run test:ci
```

#### Quick Health Check
```bash
# Test server health
curl -f http://localhost:3001/health || echo "Server not running"

# Run complete test suite
npm run test:ci
```

## 📁 Project Structure

```
pact-contract-testing/
├── scripts/
│   ├── start-servers.js              # Server management
│   ├── run-ci-tests.js               # Complete CI test runner
│   ├── run-tests-with-servers.js     # Full test suite runner
│   └── run-provider-tests-with-server.js # Provider test runner
├── examples/
│   ├── consumer/                     # Consumer tests (11 tests)
│   ├── provider/                     # Provider tests (3 tests)
│   └── advanced/                     # Advanced tests (16 tests)
├── .github/workflows/
│   ├── pact-ci.yml                   # Complete CI/CD pipeline
│   └── pages.yml                     # GitHub Pages publishing
└── package.json                      # Updated with new scripts
```

## 🎯 Best Practices

### For Development
1. **Use `npm run test:ci`** for complete testing
2. **Use `npm run test:working`** for quick consumer + provider tests
3. **Use `npm run start:servers`** for manual server management
4. **Check logs** in the `logs/` directory for debugging

### For CI/CD
1. **Use `npm run test:ci`** in GitHub Actions
2. **Enable GitHub Pages** for report publishing
3. **Create `github-pages` environment** for deployment
4. **Monitor test results** in GitHub Actions tab

### For Learning
1. **Start with `npm run test:single`** for basic understanding
2. **Progress to `npm run test:consumer`** for PACT concepts
3. **Use `npm run test:working`** for complete contract testing
4. **Explore `npm run test:advanced`** for integration testing

## 🎉 Success Metrics

### ✅ What We've Achieved
- **30+ Tests Passing** - Complete test coverage
- **Zero Port Conflicts** - All server management issues resolved
- **Automatic Server Management** - No manual intervention required
- **Complete CI/CD Pipeline** - GitHub Actions ready
- **GitHub Pages Integration** - Automatic report publishing
- **Comprehensive Documentation** - Complete guides and examples

### 🚀 Ready for Production Use
- **Educational Framework** - Perfect for learning PACT
- **CI/CD Ready** - GitHub Actions integration
- **Report Publishing** - Professional test reports
- **Security Compliant** - Vulnerability scanning
- **Well Documented** - Comprehensive guides

## 🆘 Getting Help

If you encounter issues:

1. **Check the logs** in the `logs/` directory
2. **Use `npm run test:ci`** for complete testing
3. **Review the troubleshooting section** above
4. **Check GitHub Actions** for CI/CD issues
5. **Consult the documentation** in the `docs/` directory

## 📚 Additional Resources

- [Main README](README.md) - Complete project overview
- [Quick Start Guide](QUICK_START_GUIDE.md) - Step-by-step instructions
- [GitHub Actions Setup](GITHUB_ACTIONS_SETUP.md) - CI/CD configuration
- [Project Summary](PROJECT_SUMMARY.md) - Complete project overview
- [Complete Feature Summary](COMPLETE_FEATURE_SUMMARY.md) - All features

---

**Happy Testing! 🧪✨**

The PACT Contract Testing Framework is now complete with automatic server management, 30+ passing tests, and full CI/CD integration!
