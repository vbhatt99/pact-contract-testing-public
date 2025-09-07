# 🚀 PACT Testing - Quick Command Reference

## 🏃‍♂️ Quick Start Commands

```bash
# Automated test script (recommended)
npm run test:framework

# Complete test run
npm run test:all

# Individual test steps
npm run test:simple          # Consumer tests
npm run start:provider       # Start provider server
npm run test:verification    # Provider verification
npm run health:check         # Health check
```

## 📋 All Available Commands

### Test Commands
```bash
npm run test                 # Run all tests
npm run test:framework       # Automated test script
npm run test:all             # Complete test suite
npm run test:reports         # Complete test suite with reports
npm run test:reports:json    # Generate JSON reports
npm run test:reports:quiet   # Generate reports quietly
npm run test:consumer        # Consumer tests only
npm run test:provider        # Provider tests only
npm run test:contract        # Contract tests only
npm run test:simple          # Simple consumer test
npm run test:verification    # Provider verification
npm run ci:test              # Complete CI test suite
```

### Setup & Cleanup
```bash
npm run ci:setup             # Create directories
npm run ci:cleanup           # Clean test artifacts
```

### Server Commands
```bash
npm run start:provider       # Start provider server
npm run start:consumer       # Start consumer client
npm run start:broker         # Start PACT broker
```

### Health & Security
```bash
npm run health:check         # Check provider health
npm run security:audit       # Security vulnerability scan
npm run security:check       # High-level security check
```

### PACT Operations
```bash
npm run pact:publish         # Publish contracts to broker
npm run pact:verify          # Verify contracts from broker
```

### Report Commands
```bash
npm run reports:generate     # Generate test reports
npm run reports:view         # View latest report in browser
npm run reports:list         # List all available reports
```

## 🔧 Troubleshooting Commands

### Port Management
```bash
# Check what's using port 3001
lsof -ti:3001

# Kill process on port 3001
kill -9 $(lsof -ti:3001)

# Use different port
PORT=3002 npm run start:provider
```

### Process Management
```bash
# Find Node.js processes
ps aux | grep node | grep -v grep

# Kill all Node.js processes
pkill -f node
```

### File Management
```bash
# Check generated PACT files
ls -la pacts/

# View PACT contract
cat pacts/UserServiceConsumer-UserServiceProvider.json | jq '.'

# Count interactions
cat pacts/UserServiceConsumer-UserServiceProvider.json | jq '.interactions | length'
```

### API Testing
```bash
# Test provider endpoints
curl http://localhost:3001/health
curl http://localhost:3001/api/users
curl http://localhost:3001/api/users/1
curl http://localhost:3001/api/users/999
```

## 🐳 Docker Commands

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run specific service
docker-compose run provider npm run test:verification
docker-compose run consumer npm run test:simple

# Clean up Docker
docker-compose down
docker system prune -f
```

## 📊 Test Output Interpretation

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

## 🎯 Common Test Scenarios

### Scenario 1: First Time Setup
```bash
npm install
npm run ci:setup
npm run ci:test
```

### Scenario 2: Development Testing
```bash
npm run test:simple
npm run start:provider
npm run test:verification
```

### Scenario 3: CI/CD Simulation
```bash
npm run ci:setup
npm run ci:test
npm run security:audit
npm run ci:cleanup
```

### Scenario 4: Debugging Issues
```bash
npm run ci:cleanup
npm run ci:setup
npm run test:simple
npm run start:provider
curl http://localhost:3001/health
npm run test:verification
```

## 📁 Key Files to Check

```
pacts/UserServiceConsumer-UserServiceProvider.json  # Generated contracts
logs/                                               # Test logs
examples/consumer/__tests__/                        # Consumer tests
examples/provider/__tests__/                        # Provider tests
examples/provider/server.js                         # Provider server
```

## 🚨 Emergency Commands

### Reset Everything
```bash
npm run ci:cleanup
pkill -f node
rm -rf node_modules package-lock.json
npm install
npm run ci:setup
```

### Quick Health Check
```bash
curl -f http://localhost:3001/health || echo "Provider not running"
npm run security:audit
```

### Force Clean Start
```bash
docker-compose down
docker system prune -f
npm run ci:cleanup
npm run ci:setup
```

---

**💡 Pro Tip**: Always run `npm run ci:setup` before testing to ensure clean environment!
