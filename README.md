# PACT Contract Testing Framework

> **⚠️ IMPORTANT DISCLAIMER**: This repository is for **educational and testing purposes only**. It provides examples and guidance for learning PACT contract testing concepts. Users are responsible for their own implementation, security, compliance, and production use. See [LICENSE](LICENSE) and [DISCLAIMER](DISCLAIMER.md) for full terms.

A comprehensive, production-ready PACT-based contract testing framework that covers everything from basic examples to advanced scenarios including bi-directional contracts, performance testing, and CI/CD integration.

## 🎯 Purpose

This framework is designed to:
- **Educate** developers on PACT contract testing concepts
- **Demonstrate** best practices and patterns
- **Provide** working examples for learning
- **Guide** implementation of contract testing in real projects

## 🚀 Quick Start

### Run Tests
```bash
# Automated test script with reports (recommended)
npm run test:framework

# Complete test suite with reports
npm run test:reports

# Complete test suite
npm run test:all

# Individual tests
npm run test:simple          # Consumer tests
npm run start:provider       # Start provider server
npm run test:verification    # Provider verification

# View reports
npm run reports:view         # View latest report in browser
npm run reports:list         # List all available reports
```

### Documentation
- 📖 **[Complete Test Guide](RUN_TESTS_README.md)** - Step-by-step testing instructions
- ⚡ **[Quick Command Reference](TEST_COMMANDS_QUICK_REFERENCE.md)** - All available commands
- 📚 **[Testing Documentation Summary](TESTING_DOCUMENTATION_SUMMARY.md)** - Overview of all testing resources
- 📚 **[Basic Guide](docs/BASIC_GUIDE.md)** - Getting started with PACT
- 🔧 **[Advanced Guide](docs/ADVANCED_GUIDE.md)** - Advanced PACT concepts
- 🚀 **[CI/CD Guide](docs/CI_CD_GUIDE.md)** - GitHub Actions integration

## ⚠️ Important Notes

- **Testing Only**: This is a demonstration framework, not production-ready code
- **User Responsibility**: All security, compliance, and production considerations are the user's responsibility
- **No Warranty**: Provided "as-is" without any warranties or guarantees
- **Educational Use**: Intended for learning and development purposes only
