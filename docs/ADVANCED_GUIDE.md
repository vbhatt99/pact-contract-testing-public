# Advanced PACT Contract Testing Guide

> **⚠️ IMPORTANT DISCLAIMER**: This guide is for **educational and testing purposes only**. The advanced scenarios and patterns shown are demonstrations for learning PACT concepts. They are not production-ready and should not be used in production without proper security review, compliance validation, and customization for your specific environment. Users are responsible for their own implementation, security, compliance, and production use.

This guide covers advanced PACT contract testing scenarios, including bi-directional contracts, performance testing, and production-ready patterns.

## 🔄 Bi-directional Contract Testing

In complex microservices architectures, services often consume from multiple providers and provide to multiple consumers. Bi-directional contract testing ensures all interactions work correctly.

### Multi-Provider Testing

```javascript
describe('E-commerce User Journey', () => {
  let userProvider, productProvider, orderProvider;

  beforeAll(() => {
    // Set up multiple providers
    userProvider = new Pact({
      consumer: 'ECommerceFrontend',
      provider: 'UserService',
      port: 3004
    });

    productProvider = new Pact({
      consumer: 'ECommerceFrontend', 
      provider: 'ProductService',
      port: 3005
    });

    orderProvider = new Pact({
      consumer: 'ECommerceFrontend',
      provider: 'OrderService', 
      port: 3006
    });

    return Promise.all([
      userProvider.setup(),
      productProvider.setup(),
      orderProvider.setup()
    ]);
  });

  it('should handle complete user registration and shopping flow', async () => {
    // Step 1: User registration
    await userProvider
      .given('no users exist')
      .uponReceiving('user registration')
      .withRequest({
        method: 'POST',
        path: '/api/users',
        body: { name: 'John Doe', email: 'john@example.com' }
      })
      .willRespondWith({
        status: 201,
        body: userMatcher
      });

    // Step 2: Browse products
    await productProvider
      .given('products exist')
      .uponReceiving('product catalog request')
      .withRequest({
        method: 'GET',
        path: '/api/products'
      })
      .willRespondWith({
        status: 200,
        body: [productMatcher]
      });

    // Step 3: Create order
    await orderProvider
      .given('user with id 1 exists')
      .uponReceiving('order creation')
      .withRequest({
        method: 'POST',
        path: '/api/orders',
        body: { userId: 1, products: [{ productId: 1, quantity: 2 }] }
      })
      .willRespondWith({
        status: 201,
        body: orderMatcher
      });
  });
});
```

## ⚡ Performance Contract Testing

Define performance expectations as part of your contracts.

### Response Time Contracts

```javascript
describe('Performance Contract Testing', () => {
  it('should respond within acceptable time limits', async () => {
    await provider
      .given('users exist')
      .uponReceiving('a fast user request')
      .withRequest({
        method: 'GET',
        path: '/api/users'
      })
      .willRespondWith({
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'X-Response-Time': '50ms'
        },
        body: [userMatcher]
      });

    // Performance assertions
    const startTime = Date.now();
    const users = await userService.getAllUsers();
    const duration = Date.now() - startTime;
    
    expect(duration).toBeLessThan(1000); // Should complete within 1 second
  });
});
```

### Concurrent Request Handling

```javascript
it('should handle multiple concurrent requests', async () => {
  const promises = [];
  
  for (let i = 0; i < 10; i++) {
    const promise = provider
      .given('users exist')
      .uponReceiving(`concurrent request ${i}`)
      .withRequest({
        method: 'GET',
        path: '/api/users'
      })
      .willRespondWith({
        status: 200,
        body: [userMatcher]
      });
    
    promises.push(promise);
  }

  await Promise.all(promises);
});
```

## 🎯 Advanced State Management

### Complex State Scenarios

```javascript
class StateManager {
  async setupComplexScenario(scenarioName) {
    switch (scenarioName) {
      case 'e-commerce flow':
        await this.setupUsersExist();
        await this.setupProductsExist();
        await this.setupOrdersExist();
        break;
      case 'user registration flow':
        await this.setupNoUsers();
        break;
      default:
        throw new Error(`Unknown scenario: ${scenarioName}`);
    }
  }

  async setupUsersExist() {
    // In a real application, this would interact with your database
    console.log('Setting up state: users exist');
    return Promise.resolve();
  }
}
```

### State Validation

```javascript
describe('State Management', () => {
  let stateManager;

  beforeEach(() => {
    stateManager = new StateManager();
  });

  it('should validate complex state scenarios', async () => {
    await stateManager.setupComplexScenario('e-commerce flow');
    
    // Validate the state
    const isValid = stateManager.validateState('users exist', {
      count: 2,
      active: true
    });
    
    expect(isValid).toBe(true);
  });
});
```

## 🔍 Contract Validation

### Schema Validation

```javascript
class ContractValidator {
  validateUser(user) {
    const schema = {
      type: 'object',
      properties: {
        id: { type: 'integer', minimum: 1 },
        name: { type: 'string', minLength: 1 },
        email: { type: 'string', format: 'email' }
      },
      required: ['id', 'name', 'email']
    };

    const validate = ajv.compile(schema);
    const isValid = validate(user);
    
    if (!isValid) {
      return { valid: false, errors: validate.errors };
    }
    
    return { valid: true };
  }
}
```

### Backward Compatibility

```javascript
describe('Backward Compatibility', () => {
  it('should maintain backward compatibility', async () => {
    // Test with old contract version
    const oldContract = await loadContract('v1.0.0');
    const newContract = await loadContract('v1.1.0');
    
    const compatibility = validator.validateBackwardCompatibility(
      oldContract, 
      newContract
    );
    
    expect(compatibility.backwardCompatible).toBe(true);
  });
});
```

## 🚀 Production Patterns

### Error Handling

```javascript
describe('Error Handling Scenarios', () => {
  it('should handle service unavailability gracefully', async () => {
    await provider
      .given('service is unavailable')
      .uponReceiving('a request when service is down')
      .withRequest({
        method: 'GET',
        path: '/api/users'
      })
      .willRespondWith({
        status: 503,
        body: {
          error: 'ServiceUnavailable',
          message: 'Service temporarily unavailable',
          statusCode: 503
        }
      });

    await expect(userService.getAllUsers())
      .rejects.toThrow('Service temporarily unavailable');
  });

  it('should handle rate limiting', async () => {
    await provider
      .given('rate limit exceeded')
      .uponReceiving('a request when rate limit is exceeded')
      .withRequest({
        method: 'GET',
        path: '/api/users'
      })
      .willRespondWith({
        status: 429,
        headers: { 'Retry-After': '60' },
        body: {
          error: 'RateLimitExceeded',
          message: 'Too many requests',
          statusCode: 429
        }
      });
  });
});
```

### Caching Contracts

```javascript
it('should respect cache headers', async () => {
  await provider
    .given('products exist')
    .uponReceiving('a request with cache headers')
    .withRequest({
      method: 'GET',
      path: '/api/products/1'
    })
    .willRespondWith({
      status: 200,
      headers: { 
        'Cache-Control': 'max-age=3600',
        'ETag': '"abc123"'
      },
      body: productMatcher
    });
});

it('should handle conditional requests', async () => {
  await provider
    .given('product with id 1 exists')
    .uponReceiving('a conditional request')
    .withRequest({
      method: 'GET',
      path: '/api/products/1',
      headers: { 'If-None-Match': '"abc123"' }
    })
    .willRespondWith({
      status: 304,
      headers: { 'ETag': '"abc123"' }
    });
});
```

## 🔧 Advanced Configuration

### Custom Matchers

```javascript
const customMatchers = {
  // UUID matcher
  uuid: () => term({
    matcher: '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}',
    generate: '550e8400-e29b-41d4-a716-446655440000'
  }),

  // Phone number matcher
  phoneNumber: () => term({
    matcher: '\\+?[1-9]\\d{1,14}',
    generate: '+1234567890'
  }),

  // Currency matcher
  currency: () => term({
    matcher: '\\$\\d+\\.\\d{2}',
    generate: '$99.99'
  })
};
```

### Dynamic State Handlers

```javascript
const stateHandlers = {
  'user with specific role': (params) => {
    const { role } = params;
    return setupUserWithRole(role);
  },

  'product with specific category': (params) => {
    const { category } = params;
    return setupProductWithCategory(category);
  }
};
```

## 📊 Monitoring and Observability

### Contract Metrics

```javascript
class ContractMetrics {
  recordTestExecution(testName, duration, success) {
    console.log(`Test: ${testName}, Duration: ${duration}ms, Success: ${success}`);
    
    // In production, send to monitoring system
    this.sendToMonitoring({
      test: testName,
      duration,
      success,
      timestamp: new Date().toISOString()
    });
  }

  generateReport() {
    return {
      totalTests: this.testCount,
      successRate: this.successRate,
      averageDuration: this.averageDuration,
      failures: this.failures
    };
  }
}
```

### Health Checks

```javascript
describe('Health Checks', () => {
  it('should verify provider health', async () => {
    await provider
      .given('service is healthy')
      .uponReceiving('a health check request')
      .withRequest({
        method: 'GET',
        path: '/health'
      })
      .willRespondWith({
        status: 200,
        body: {
          status: 'healthy',
          timestamp: iso8601DateTime(),
          version: like('1.0.0')
        }
      });
  });
});
```

## 🎯 Best Practices

> **⚠️ EDUCATIONAL NOTE**: These best practices are for learning purposes. In production, you must implement additional security, compliance, and operational considerations.

### 1. Contract Design
- Keep contracts focused and specific
- Use meaningful provider states
- Include error scenarios
- Version your contracts

### 2. Test Organization
- Group related interactions
- Use descriptive test names
- Maintain test data consistency
- Clean up after tests

### 3. Performance Considerations
- Set reasonable timeouts
- Use connection pooling
- Monitor resource usage
- Optimize test execution

### 4. Maintenance
- Regular contract reviews
- Update dependencies
- Monitor breaking changes
- Document changes

### 5. Security Considerations (Production)
- **You are responsible for implementing:**
  - Proper authentication and authorization
  - Data encryption and protection
  - Network security measures
  - Compliance with regulations
  - Security monitoring and alerting

## 🚨 Common Advanced Pitfalls

### 1. State Pollution
❌ **Don't do this:**
```javascript
// Tests interfere with each other
beforeEach(() => {
  // No cleanup between tests
});
```

✅ **Do this:**
```javascript
afterEach(() => {
  return stateManager.cleanupAllStates();
});
```

### 2. Overly Complex Contracts
❌ **Don't do this:**
```javascript
// One massive contract for everything
await provider
  .given('complex system state')
  .uponReceiving('everything request')
  .withRequest({...})
  .willRespondWith({...});
```

✅ **Do this:**
```javascript
// Multiple focused contracts
await provider
  .given('users exist')
  .uponReceiving('user request')
  .withRequest({...})
  .willRespondWith({...});
```

### 3. Ignoring Performance
❌ **Don't do this:**
```javascript
// No performance considerations
const users = await userService.getAllUsers();
```

✅ **Do this:**
```javascript
// Include performance expectations
const startTime = Date.now();
const users = await userService.getAllUsers();
const duration = Date.now() - startTime;
expect(duration).toBeLessThan(1000);
```

## 📚 Next Steps

1. **Explore the advanced examples** in the framework
2. **Set up monitoring** for your contracts
3. **Implement bi-directional testing** for complex scenarios
4. **Add performance testing** to your contracts
5. **Integrate with your CI/CD pipeline**

## 🆘 Advanced Troubleshooting

### Debugging Complex States
```javascript
// Add detailed logging
const stateManager = new StateManager();
stateManager.on('stateChange', (state, data) => {
  console.log(`State changed: ${state}`, data);
});
```

### Performance Analysis
```javascript
// Profile test execution
const profiler = new TestProfiler();
profiler.start('user-service-test');
// ... run tests
profiler.end('user-service-test');
console.log(profiler.getReport());
```

Happy advanced contract testing! 🚀
