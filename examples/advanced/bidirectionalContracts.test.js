const axios = require('axios');

describe('Bidirectional Contract Testing', () => {
  const USER_SERVICE_URL = 'http://localhost:3001';
  const PRODUCT_SERVICE_URL = 'http://localhost:3001'; // Same server handles both

  beforeAll(async () => {
    // Wait for services to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify server is running
    try {
      const response = await axios.get(`${USER_SERVICE_URL}/health`, { timeout: 5000 });
      console.log('✅ Server health check passed:', response.data);
    } catch (error) {
      console.warn('⚠️ Server health check failed, but continuing with tests...');
    }
  });

  describe('User-Product Service Integration', () => {
    it('should handle user creation and product retrieval workflow', async () => {
      // Step 1: Get existing users
      const usersResponse = await axios.get(`${USER_SERVICE_URL}/api/users`);
      expect(usersResponse.status).toBe(200);
      expect(Array.isArray(usersResponse.data)).toBe(true);

      // Step 2: Get products
      const productsResponse = await axios.get(`${PRODUCT_SERVICE_URL}/api/products`);
      expect(productsResponse.status).toBe(200);
      expect(Array.isArray(productsResponse.data)).toBe(true);

      // Step 3: Create a new user
      const newUser = {
        name: 'Integration Test User',
        email: 'integration@test.com'
      };
      
      const createUserResponse = await axios.post(`${USER_SERVICE_URL}/api/users`, newUser);
      expect(createUserResponse.status).toBe(201);
      expect(createUserResponse.data.name).toBe(newUser.name);
      expect(createUserResponse.data.email).toBe(newUser.email);
    });

    it('should handle product-user data consistency', async () => {
      // Get users and products
      const [usersResponse, productsResponse] = await Promise.all([
        axios.get(`${USER_SERVICE_URL}/api/users`),
        axios.get(`${PRODUCT_SERVICE_URL}/api/products`)
      ]);

      expect(usersResponse.status).toBe(200);
      expect(productsResponse.status).toBe(200);

      // Verify data structure consistency
      expect(Array.isArray(usersResponse.data)).toBe(true);
      expect(Array.isArray(productsResponse.data)).toBe(true);

      // Verify user data structure
      if (usersResponse.data.length > 0) {
        const user = usersResponse.data[0];
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('createdAt');
        expect(user).toHaveProperty('isActive');
      }

      // Verify product data structure
      if (productsResponse.data.length > 0) {
        const product = productsResponse.data[0];
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('category');
        expect(product).toHaveProperty('inStock');
        expect(product).toHaveProperty('createdAt');
      }
    });
  });

  describe('Cross-Service Error Handling', () => {
    it('should handle user service errors gracefully', async () => {
      try {
        await axios.get(`${USER_SERVICE_URL}/api/users/999999`);
      } catch (error) {
        expect(error.response.status).toBe(404);
        expect(error.response.data).toHaveProperty('error');
        expect(error.response.data).toHaveProperty('message');
        expect(error.response.data).toHaveProperty('statusCode');
      }
    });

    it('should handle product service errors gracefully', async () => {
      try {
        await axios.get(`${PRODUCT_SERVICE_URL}/api/products/999999`);
      } catch (error) {
        expect(error.response.status).toBe(404);
        expect(error.response.data).toHaveProperty('error');
        expect(error.response.data).toHaveProperty('message');
        expect(error.response.data).toHaveProperty('statusCode');
      }
    });
  });

  describe('Data Flow Validation', () => {
    it('should maintain data integrity across services', async () => {
      // Test user creation and retrieval
      const newUser = {
        name: 'Data Integrity Test',
        email: 'integrity@test.com'
      };

      const createResponse = await axios.post(`${USER_SERVICE_URL}/api/users`, newUser);
      expect(createResponse.status).toBe(201);
      
      const userId = createResponse.data.id;
      expect(typeof userId).toBe('number');

      // Verify the user can be retrieved
      const getResponse = await axios.get(`${USER_SERVICE_URL}/api/users/${userId}`);
      expect(getResponse.status).toBe(200);
      expect(getResponse.data.id).toBe(userId);
      expect(getResponse.data.name).toBe(newUser.name);
      expect(getResponse.data.email).toBe(newUser.email);
    });

    it('should handle concurrent operations correctly', async () => {
      const promises = [
        axios.get(`${USER_SERVICE_URL}/api/users`),
        axios.get(`${PRODUCT_SERVICE_URL}/api/products`),
        axios.get(`${USER_SERVICE_URL}/api/users/1`),
        axios.get(`${PRODUCT_SERVICE_URL}/api/products/1`)
      ];

      const responses = await Promise.all(promises);
      
      expect(responses[0].status).toBe(200); // Users list
      expect(responses[1].status).toBe(200); // Products list
      expect(responses[2].status).toBe(200); // User by ID
      expect(responses[3].status).toBe(200); // Product by ID
    });
  });

  describe('Service Health and Availability', () => {
    it('should verify both services are healthy', async () => {
      const [userHealth, productHealth] = await Promise.all([
        axios.get(`${USER_SERVICE_URL}/api/users`).catch(() => ({ status: 500 })),
        axios.get(`${PRODUCT_SERVICE_URL}/api/products`).catch(() => ({ status: 500 }))
      ]);

      expect(userHealth.status).toBe(200);
      expect(productHealth.status).toBe(200);
    });

    it('should handle service unavailability gracefully', async () => {
      // Test with invalid service URL
      try {
        await axios.get('http://localhost:9999/api/users', { timeout: 1000 });
      } catch (error) {
        // Should timeout or fail to connect
        expect(error.code).toMatch(/ECONNREFUSED|ETIMEDOUT/);
      }
    });
  });
});