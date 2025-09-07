# PACT Contract Testing Framework

> **⚠️ IMPORTANT DISCLAIMER**: This repository is for **educational and testing purposes only**. It provides examples and guidance for learning PACT contract testing concepts. Users are responsible for their own implementation, security, compliance, and production use. See [LICENSE](../LICENSE) and [DISCLAIMER](../DISCLAIMER.md) for full terms.

A comprehensive, production-ready PACT-based contract testing framework that covers everything from basic examples to advanced scenarios including bi-directional contracts, performance testing, and CI/CD integration.

## 🎯 Purpose

This framework is designed to:
- **Educate** developers on PACT contract testing concepts
- **Demonstrate** best practices and patterns
- **Provide** working examples for learning
- **Guide** implementation of contract testing in real projects

## ⚠️ Important Notes

- **Testing Only**: This is a demonstration framework, not production-ready code
- **User Responsibility**: All security, compliance, and production considerations are the user's responsibility
- **No Warranty**: Provided "as-is" without any warranties or guarantees
- **Educational Use**: Intended for learning and development purposes only

## 🚀 Features

### Basic Level
- ✅ Simple consumer-provider contracts
- ✅ User, Product, and Order service examples
- ✅ Basic PACT matchers and schemas
- ✅ Provider verification tests

### Intermediate Level
- ✅ Advanced state management
- ✅ Contract validation utilities
- ✅ Error handling scenarios
- ✅ Data consistency testing

### Advanced Level
- ✅ Bi-directional contract testing
- ✅ Performance contract testing
- ✅ Concurrent request handling
- ✅ Caching and conditional requests
- ✅ Memory usage contracts

### Production Ready
- ✅ CI/CD pipeline with GitHub Actions
- ✅ Docker containerization
- ✅ PACT Broker integration
- ✅ Security scanning
- ✅ Integration testing

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
├── .github/workflows/      # CI/CD pipelines
├── docker-compose.yml      # Docker orchestration
└── package.json           # Dependencies and scripts
```

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+ 
- Docker (optional, for PACT Broker)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pact-contract-testing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the PACT Broker (optional)**
   ```bash
   docker run --rm -p 9292:9292 pactfoundation/pact-broker
   ```

### Running Tests

1. **Run consumer tests**
   ```bash
   npm run test:consumer
   ```

2. **Start provider server**
   ```bash
   npm run start:provider
   ```

3. **Run provider verification**
   ```bash
   npm run test:provider
   ```

4. **Run all tests**
   ```bash
   npm test
   ```

## 📚 Learning Path

### 1. Basic Concepts
Start with the basic examples in `examples/consumer/` and `examples/provider/` to understand:
- How to create PACT contracts
- Consumer-driven contract testing
- Provider verification
- Basic matchers and schemas

### 2. Intermediate Features
Explore `examples/advanced/` for:
- State management patterns
- Contract validation
- Error handling strategies
- Data consistency testing

### 3. Advanced Scenarios
Dive into advanced testing:
- Bi-directional contracts
- Performance testing
- Concurrent request handling
- Caching strategies

### 4. Production Deployment
Use the CI/CD pipeline and Docker setup:
- Automated testing
- PACT Broker integration
- Security scanning
- Integration testing

## 🔧 Configuration

### Environment Variables
```bash
# PACT Broker
PACT_BROKER_BASE_URL=http://localhost:9292
PACT_BROKER_TOKEN=your-token

# Provider
PROVIDER_URL=http://localhost:3001
PORT=3001

# Consumer
CONSUMER_URL=http://localhost:3000
```

### PACT Broker Setup
1. Start the broker: `docker run --rm -p 9292:9292 pactfoundation/pact-broker`
2. Access the UI: http://localhost:9292
3. Configure authentication if needed

## 🧪 Test Examples

### Basic Consumer Test
```javascript
describe('User Service PACT', () => {
  it('should return a list of users', async () => {
    await provider
      .given('users exist')
      .uponReceiving('a request for all users')
      .withRequest({
        method: 'GET',
        path: '/api/users'
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: userListMatcher
      });

    const users = await userService.getAllUsers();
    expect(users).toBeDefined();
  });
});
```

### Advanced Bi-directional Test
```javascript
describe('E-commerce User Journey', () => {
  it('should handle complete user registration and shopping flow', async () => {
    // Multiple service interactions
    await userProvider.given('no users exist')...
    await productProvider.given('products exist')...
    await orderProvider.given('user with id 1 exists')...
  });
});
```

## 🚀 CI/CD Integration

The framework includes a complete CI/CD pipeline with:

- **Consumer Tests**: Run on every PR and push
- **Provider Verification**: Validates contracts against real services
- **Contract Validation**: Ensures backward compatibility
- **Security Scanning**: Audits dependencies
- **Integration Tests**: End-to-end testing

### GitHub Actions Workflow
```yaml
name: PACT Contract Testing CI/CD
on: [push, pull_request]
jobs:
  consumer-tests: # Run consumer tests
  provider-tests: # Verify provider contracts
  contract-validation: # Check compatibility
  security-scan: # Audit dependencies
  integration-tests: # End-to-end testing
```

## 🐳 Docker Support

### Quick Start with Docker
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Services Included
- **PACT Broker**: Contract storage and management
- **Provider**: API service
- **Consumer**: Test client
- **PostgreSQL**: Database for PACT Broker
- **Nginx**: Load balancer and proxy

## 📊 Monitoring and Observability

### PACT Broker Dashboard
- View all contracts and their status
- Track verification results
- Monitor breaking changes
- Generate compatibility reports

### Logging
- Structured logging with timestamps
- Performance metrics
- Error tracking
- Test execution details

## 🔒 Security Features

> **⚠️ SECURITY NOTICE**: The security features shown in this framework are for **demonstration purposes only**. They are not production-ready and should not be used as-is in production environments. Users must implement their own security measures.

- **Dependency Auditing**: Automated security scanning (demonstration only)
- **Authentication**: PACT Broker authentication (basic examples)
- **HTTPS Support**: Secure communication (configuration examples)
- **Input Validation**: Schema validation (basic patterns)
- **Rate Limiting**: Request throttling (example implementations)

### ⚠️ Security Responsibilities

**You are solely responsible for:**
- Implementing production-grade security measures
- Ensuring compliance with security regulations
- Conducting security audits and penetration testing
- Implementing proper authentication and authorization
- Protecting sensitive data and credentials
- Following your organization's security policies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

### Development Guidelines
- Follow the existing code structure
- Add comprehensive tests
- Update documentation
- Use semantic versioning
- Follow security best practices

## 📖 Additional Resources

- [PACT Documentation](https://docs.pact.io/)
- [Consumer-Driven Contracts](https://martinfowler.com/articles/consumerDrivenContracts.html)
- [Microservices Testing](https://microservices.io/patterns/testing/service-contract-test.html)
- [API Design Best Practices](https://restfulapi.net/)

## 🆘 Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check for running services
   lsof -i :3001
   lsof -i :9292
   ```

2. **PACT Broker Connection**
   ```bash
   # Test broker connectivity
   curl http://localhost:9292
   ```

3. **Test Failures**
   ```bash
   # Check logs
   tail -f logs/pact.log
   ```

### Getting Help
- Check the logs in the `logs/` directory
- Review the PACT Broker dashboard
- Consult the troubleshooting guide
- Open an issue for bugs or questions

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- PACT Foundation for the excellent tooling
- The microservices community for best practices
- Contributors and maintainers
