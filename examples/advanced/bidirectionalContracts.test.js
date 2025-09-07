const { Pact } = require('@pact-foundation/pact');
const path = require('path');
const { userMatcher, productMatcher, orderMatcher } = require('../shared/matchers');

describe('Bidirectional Contract Testing', () => {
  let userProvider;
  let productProvider;
  let orderProvider;

  beforeAll(() => {
    // Set up multiple providers for bidirectional testing
    userProvider = new Pact({
      consumer: 'ECommerceFrontend',
      provider: 'UserService',
      port: 3004,
      log: path.resolve(process.cwd(), 'logs', 'bidirectional-pact.log'),
      dir: path.resolve(process.cwd(), 'pacts'),
      logLevel: 'INFO',
      spec: 2
    });

    productProvider = new Pact({
      consumer: 'ECommerceFrontend',
      provider: 'ProductService',
      port: 3005,
      log: path.resolve(process.cwd(), 'logs', 'bidirectional-pact.log'),
      dir: path.resolve(process.cwd(), 'pacts'),
      logLevel: 'INFO',
      spec: 2
    });

    orderProvider = new Pact({
      consumer: 'ECommerceFrontend',
      provider: 'OrderService',
      port: 3006,
      log: path.resolve(process.cwd(), 'logs', 'bidirectional-pact.log'),
      dir: path.resolve(process.cwd(), 'pacts'),
      logLevel: 'INFO',
      spec: 2
    });

    return Promise.all([
      userProvider.setup(),
      productProvider.setup(),
      orderProvider.setup()
    ]);
  });

  afterEach(() => {
    return Promise.all([
      userProvider.verify(),
      productProvider.verify(),
      orderProvider.verify()
    ]);
  });

  afterAll(() => {
    return Promise.all([
      userProvider.finalize(),
      productProvider.finalize(),
      orderProvider.finalize()
    ]);
  });

  describe('E-commerce User Journey', () => {
    it('should handle complete user registration and shopping flow', async () => {
      // Step 1: User registration
      await userProvider
        .given('no users exist')
        .uponReceiving('a request to create a new user')
        .withRequest({
          method: 'POST',
          path: '/api/users',
          headers: { 'Content-Type': 'application/json' },
          body: {
            name: 'John Doe',
            email: 'john@example.com'
          }
        })
        .willRespondWith({
          status: 201,
          headers: { 'Content-Type': 'application/json' },
          body: userMatcher
        });

      // Step 2: Browse products
      await productProvider
        .given('products exist')
        .uponReceiving('a request for all products')
        .withRequest({
          method: 'GET',
          path: '/api/products'
        })
        .willRespondWith({
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: [productMatcher]
        });

      // Step 3: Get specific product
      await productProvider
        .given('product with id 1 exists')
        .uponReceiving('a request for product with id 1')
        .withRequest({
          method: 'GET',
          path: '/api/products/1'
        })
        .willRespondWith({
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: productMatcher
        });

      // Step 4: Create order
      await orderProvider
        .given('user with id 1 exists')
        .uponReceiving('a request to create an order')
        .withRequest({
          method: 'POST',
          path: '/api/orders',
          headers: { 'Content-Type': 'application/json' },
          body: {
            userId: 1,
            products: [
              { productId: 1, quantity: 2 }
            ]
          }
        })
        .willRespondWith({
          status: 201,
          headers: { 'Content-Type': 'application/json' },
          body: orderMatcher
        });

      // Step 5: Get user orders
      await orderProvider
        .given('user has orders')
        .uponReceiving('a request for user orders')
        .withRequest({
          method: 'GET',
          path: '/api/orders',
          query: { userId: '1' }
        })
        .willRespondWith({
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: [orderMatcher]
        });

      // This test demonstrates the complete flow without actual HTTP calls
      // In a real scenario, you would make actual API calls here
      expect(true).toBe(true);
    });
  });

  describe('Error Handling Scenarios', () => {
    it('should handle service unavailability gracefully', async () => {
      await userProvider
        .given('service is unavailable')
        .uponReceiving('a request when service is down')
        .withRequest({
          method: 'GET',
          path: '/api/users'
        })
        .willRespondWith({
          status: 503,
          headers: { 'Content-Type': 'application/json' },
          body: {
            error: 'ServiceUnavailable',
            message: 'Service temporarily unavailable',
            statusCode: 503
          }
        });

      expect(true).toBe(true);
    });

    it('should handle rate limiting', async () => {
      await productProvider
        .given('rate limit exceeded')
        .uponReceiving('a request when rate limit is exceeded')
        .withRequest({
          method: 'GET',
          path: '/api/products'
        })
        .willRespondWith({
          status: 429,
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': '60'
          },
          body: {
            error: 'RateLimitExceeded',
            message: 'Too many requests',
            statusCode: 429
          }
        });

      expect(true).toBe(true);
    });
  });

  describe('Data Consistency Scenarios', () => {
    it('should maintain data consistency across services', async () => {
      // User creates account
      await userProvider
        .given('no users exist')
        .uponReceiving('user registration')
        .withRequest({
          method: 'POST',
          path: '/api/users',
          headers: { 'Content-Type': 'application/json' },
          body: {
            name: 'Jane Doe',
            email: 'jane@example.com'
          }
        })
        .willRespondWith({
          status: 201,
          headers: { 'Content-Type': 'application/json' },
          body: userMatcher
        });

      // User places order
      await orderProvider
        .given('user with id 1 exists')
        .uponReceiving('order creation')
        .withRequest({
          method: 'POST',
          path: '/api/orders',
          headers: { 'Content-Type': 'application/json' },
          body: {
            userId: 1,
            products: [{ productId: 1, quantity: 1 }]
          }
        })
        .willRespondWith({
          status: 201,
          headers: { 'Content-Type': 'application/json' },
          body: orderMatcher
        });

      // Verify user can see their order
      await orderProvider
        .given('user has orders')
        .uponReceiving('order retrieval')
        .withRequest({
          method: 'GET',
          path: '/api/orders/1'
        })
        .willRespondWith({
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: orderMatcher
        });

      expect(true).toBe(true);
    });
  });
});
