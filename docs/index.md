# 🧪 PACT Contract Testing Framework

Welcome to the PACT Contract Testing Framework documentation and reports.

## 📊 Test Reports

The latest test reports are automatically generated and published to GitHub Pages:

- **[View Latest Reports](https://example.github.io/pact-contract-testing/)** - Comprehensive test results
- **[Test History](https://example.github.io/pact-contract-testing/)** - Historical test data

## 🚀 Quick Start

### Run Tests with Reports
```bash
# Generate comprehensive test reports
npm run test:reports

# View latest report in browser
npm run reports:view

# List all available reports
npm run reports:list
```

### Automated Testing
```bash
# Complete test suite with reporting
npm run test:framework

# CI/CD style testing
npm run test:all
```

## 📖 Documentation

- **[Complete Test Guide](../RUN_TESTS_README.md)** - Step-by-step testing instructions
- **[Quick Command Reference](../TEST_COMMANDS_QUICK_REFERENCE.md)** - All available commands
- **[Testing Documentation Summary](../TESTING_DOCUMENTATION_SUMMARY.md)** - Overview of all testing resources
- **[Basic Guide](BASIC_GUIDE.md)** - Getting started with PACT
- **[Advanced Guide](ADVANCED_GUIDE.md)** - Advanced PACT concepts
- **[CI/CD Guide](CI_CD_GUIDE.md)** - GitHub Actions integration

## 🔧 Report Features

### Generated Report Types
- **HTML Reports** - Beautiful, interactive web reports
- **JSON Reports** - Machine-readable test data
- **Markdown Reports** - Documentation-friendly format

### Report Contents
- ✅ Test execution summary
- 📊 Detailed test results
- 🛡️ Security audit findings
- 🌐 API endpoint test results
- 📄 Generated PACT contracts
- 📈 Performance metrics
- ⏱️ Execution timing

### GitHub Actions Integration
- 🔄 Automatic report generation on CI/CD runs
- 📤 Artifact upload for test results
- 🌐 GitHub Pages deployment
- 📊 Historical report tracking

## 🎯 Report Access

### Local Development
```bash
# Generate and view reports locally
npm run test:reports
npm run reports:view
```

### CI/CD Pipeline
- Reports are automatically generated on every successful test run
- Available as downloadable artifacts in GitHub Actions
- Published to GitHub Pages for easy access

### GitHub Pages
- Reports are automatically deployed to GitHub Pages
- Accessible via the repository's GitHub Pages URL
- Historical reports are preserved and accessible

## 📱 Report Features

### Interactive Elements
- 📊 Visual test result summaries
- 🎨 Color-coded status indicators
- 📈 Performance metrics charts
- 🔍 Detailed error information
- 📄 PACT contract inspection

### Responsive Design
- 📱 Mobile-friendly layout
- 💻 Desktop optimized
- 🖥️ Print-friendly format
- ♿ Accessibility compliant

## 🚨 Troubleshooting

### Report Generation Issues
```bash
# Check report generation
npm run test:reports:json

# View available reports
npm run reports:list

# Clean and regenerate
npm run ci:cleanup
npm run test:reports
```

### GitHub Pages Issues
- Ensure GitHub Pages is enabled in repository settings
- Check that the `publish-reports` job completed successfully
- Verify the `github-pages` environment is configured

## 📚 Additional Resources

- [PACT Documentation](https://docs.pact.io/)
- [Jest Testing Framework](https://jestjs.io/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [GitHub Pages](https://docs.github.com/en/pages)

---

## ⚠️ Important Notes

- **Educational Purpose**: This framework is for learning and testing purposes only
- **User Responsibility**: Users are responsible for their own implementation, security, compliance, and production use
- **No Warranty**: Provided "as-is" without any warranties or guarantees
- **Report Data**: Test reports contain sample data and should not be used for production decisions

**Happy Testing! 🧪✨**
