const { Pact } = require('@pact-foundation/pact');
const path = require('path');
const ProductService = require('../productService');
const { productMatcher, productListMatcher, errorMatcher } = require('../../shared/matchers');

describe('Product Service PACT', () => {
  let provider;
  let productService;

  beforeAll(() => {
    // Use dynamic port to avoid conflicts in parallel test runs
    const port = process.env.PACT_PORT || 3003;
    provider = new Pact({
      consumer: 'ProductServiceConsumer',
      provider: 'ProductServiceProvider',
      port: parseInt(port),
      log: path.resolve(process.cwd(), 'logs', 'pact.log'),
      dir: path.resolve(process.cwd(), 'pacts'),
      logLevel: 'INFO',
      spec: 2
    });

    return provider.setup();
  });

  beforeEach(() => {
    productService = new ProductService(provider.mockService.baseUrl);
  });

  afterEach(() => {
    provider.verify();
  });

  afterAll(() => {
    return provider.finalize();
  });

  describe('GET /api/products', () => {
    it('should return a list of products', async () => {
      // Arrange
      await provider
        .addInteraction({
          states: [{ description: 'products exist' }],
          uponReceiving: 'a request for all products',
          withRequest: {
            method: 'GET',
            path: '/api/products'
          },
          willRespondWith: {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: productListMatcher
          }
        });

      // Act
      const products = await productService.getAllProducts();

      // Assert
      expect(products).toBeDefined();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a specific product', async () => {
      // Arrange
      const productId = 1;

      await provider
        .addInteraction({
          states: [{ description: 'product with id 1 exists' }],
          uponReceiving: 'a request for product with id 1',
          withRequest: {
            method: 'GET',
            path: '/api/products/1'
          },
          willRespondWith: {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: productMatcher
          }
        });

      // Act
      const product = await productService.getProductById(productId);

      // Assert
      expect(product).toBeDefined();
      expect(product.id).toBeDefined();
      expect(typeof product.id).toBe('number');
    });

    it('should return 404 when product does not exist', async () => {
      // Arrange
      const productId = 999;

      await provider
        .addInteraction({
          states: [{ description: 'product with id 999 does not exist' }],
          uponReceiving: 'a request for non-existent product',
          withRequest: {
            method: 'GET',
            path: '/api/products/999'
          },
          willRespondWith: {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
            body: errorMatcher
          }
        });

      // Act & Assert
      await expect(productService.getProductById(productId)).rejects.toThrow('Product not found');
    });
  });
});
