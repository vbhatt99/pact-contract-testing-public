# Quick Start Guide - Running the PACT Framework

> **⚠️ IMPORTANT**: This is for educational and testing purposes only. See [DISCLAIMER](DISCLAIMER.md) for full terms.

## 🚀 Step-by-Step Execution Guide

### Prerequisites Check
Before starting, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- Git (for cloning)
- Docker (optional, for PACT Broker)

### Step 1: Install Dependencies
```bash
# Install all required packages
npm install
```

### Step 2: Run Complete Test Suite (RECOMMENDED)
```bash
# Run the complete CI test suite with automatic server management
npm run test:ci
```

**OR** for step-by-step testing:

### Step 2a: Run Consumer Tests (Generate PACT Files)
```bash
# Run consumer tests to generate PACT contracts
npm run test:consumer
```

### Step 2b: Start Provider Server
```bash
# Start the provider server in a new terminal
npm run start:provider
```

### Step 2c: Run Provider Verification
```bash
# In another terminal, verify provider against PACT contracts
npm run test:provider
```

### Step 2d: Run Advanced Tests
```bash
# Run integration and performance tests
npm run test:advanced
```

### Step 3: Optional - Start PACT Broker
```bash
# Start PACT Broker for contract management (optional)
npm run start:broker
```

## 🔍 What Each Step Does

### Complete CI Test Suite (`npm run test:ci`)
- **Consumer Tests**: Creates mock provider server, runs consumer service tests, generates PACT contracts
- **Server Management**: Automatically starts required test servers
- **Provider Tests**: Reads PACT files, makes real HTTP requests, validates provider responses
- **Advanced Tests**: Runs integration and performance tests
- **Cleanup**: Automatically stops all servers after testing
- **Results**: 30+ tests with comprehensive reporting

### Individual Test Components

### Consumer Tests
- Creates mock provider server
- Runs consumer service tests
- Generates PACT contract files in `pacts/` directory
- Validates consumer expectations

### Provider Server
- Starts Express server on port 3001
- Provides REST API endpoints
- Serves mock data for testing
- Includes health check endpoint

### Provider Verification
- Reads generated PACT files
- Makes real HTTP requests to provider
- Validates provider responses match contracts
- Reports verification results

### Advanced Tests
- Integration testing between services
- Performance testing with response time validation
- Bidirectional contract testing
- Error handling and edge case testing

### PACT Broker (Optional)
- Provides web UI for contract management
- Stores and manages PACT files
- Enables contract sharing between teams
- Accessible at http://localhost:9292

## 📊 Expected Results

### Successful Complete Test Suite (`npm run test:ci`)
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

### Generated Files
- `pacts/` directory with JSON contract files
- `logs/` directory with detailed execution logs
- Test coverage reports
- Server management logs

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :3001
   lsof -i :9292
   
   # Kill process if needed
   kill -9 <PID>
   ```

2. **Dependencies Not Installed**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **PACT Files Not Generated**
   ```bash
   # Check logs
   tail -f logs/pact.log
   
   # Ensure pacts directory exists
   mkdir -p pacts
   ```

4. **Provider Not Responding**
   ```bash
   # Test provider health
   curl http://localhost:3001/health
   
   # Check provider logs
   # Look at terminal where provider is running
   ```

## 📋 Verification Checklist

After running all steps, you should have:

- [ ] Consumer tests passing
- [ ] PACT files generated in `pacts/` directory
- [ ] Provider server running on port 3001
- [ ] Provider verification tests passing
- [ ] PACT Broker accessible (if started)
- [ ] Logs generated in `logs/` directory

## 🎯 Next Steps

1. **Explore Examples**: Look at the generated PACT files
2. **Modify Tests**: Try changing test expectations
3. **Add New Tests**: Create additional contract scenarios
4. **Read Documentation**: Review the comprehensive guides
5. **Experiment**: Try the advanced examples

## 📚 Additional Resources

- [Basic Guide](docs/BASIC_GUIDE.md) - Detailed tutorial
- [Advanced Guide](docs/ADVANCED_GUIDE.md) - Complex scenarios
- [CI/CD Guide](docs/CI_CD_GUIDE.md) - Pipeline integration
- [Project Summary](PROJECT_SUMMARY.md) - Complete overview

## 🆘 Getting Help

If you encounter issues:
1. Check the logs in `logs/pact.log`
2. Review the troubleshooting section above
3. Consult the documentation
4. Check the PACT Broker UI (if running)
5. Review the generated PACT files

Happy learning! 🎉
