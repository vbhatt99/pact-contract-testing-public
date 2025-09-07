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

### Step 2: Run Consumer Tests (Generate PACT Files)
```bash
# Run consumer tests to generate PACT contracts
npm run test:consumer
```

### Step 3: Start Provider Server
```bash
# Start the provider server in a new terminal
npm run start:provider
```

### Step 4: Run Provider Verification
```bash
# In another terminal, verify provider against PACT contracts
npm run test:provider
```

### Step 5: Optional - Start PACT Broker
```bash
# Start PACT Broker for contract management (optional)
npm run start:broker
```

## 🔍 What Each Step Does

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

### PACT Broker (Optional)
- Provides web UI for contract management
- Stores and manages PACT files
- Enables contract sharing between teams
- Accessible at http://localhost:9292

## 📊 Expected Results

### Successful Consumer Test
```
✓ should return a list of users
✓ should return a specific user
✓ should return 404 when user does not exist
✓ should create a new user
✓ should return 400 for invalid user data
```

### Successful Provider Verification
```
✓ User Service Provider Verification
  ✓ should verify the user service contracts
```

### Generated Files
- `pacts/` directory with JSON contract files
- `logs/pact.log` with detailed execution logs
- Test coverage reports

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
