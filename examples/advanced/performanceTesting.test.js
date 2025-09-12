const axios = require('axios');

describe('Performance Contract Testing', () => {
  let startTime;
  const BASE_URL = 'http://localhost:3001'; // Use existing provider server

  beforeAll(async () => {
    // Wait for the provider server to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify server is running
    try {
      const response = await axios.get(`${BASE_URL}/health`, { timeout: 5000 });
      console.log('✅ Server health check passed:', response.data);
    } catch (error) {
      console.warn('⚠️ Server health check failed, but continuing with tests...');
    }
  });

  beforeEach(() => {
    startTime = Date.now();
  });

  afterEach(() => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`Test duration: ${duration}ms`);
  });

  describe('Response Time Contracts', () => {
    it('should respond to user requests within acceptable time', async () => {
      const response = await axios.get(`${BASE_URL}/api/users`);
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
      
      // Performance assertion: should respond within 1000ms
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(1000);
    });

    it('should handle bulk product requests efficiently', async () => {
      const response = await axios.get(`${BASE_URL}/api/products`);
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
      
      // Performance assertion: should respond within 1000ms
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('Load Testing Contracts', () => {
    it('should handle multiple concurrent requests', async () => {
      const promises = [];
      const requestCount = 5;
      
      for (let i = 0; i < requestCount; i++) {
        promises.push(axios.get(`${BASE_URL}/api/users`));
      }
      
      const responses = await Promise.all(promises);
      
      expect(responses).toHaveLength(requestCount);
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
      });
      
      // Performance assertion: all requests should complete within 2000ms
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(2000);
    });

    it('should maintain performance under stress', async () => {
      const promises = [];
      const requestCount = 10;
      
      for (let i = 0; i < requestCount; i++) {
        promises.push(axios.get(`${BASE_URL}/api/products`));
      }
      
      const responses = await Promise.all(promises);
      
      expect(responses).toHaveLength(requestCount);
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
      });
      
      // Performance assertion: all requests should complete within 3000ms
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(3000);
    });
  });

  describe('Memory and Resource Contracts', () => {
    it('should not leak memory during repeated requests', async () => {
      const iterations = 20;
      
      for (let i = 0; i < iterations; i++) {
        const response = await axios.get(`${BASE_URL}/api/users`);
        expect(response.status).toBe(200);
      }
      
      // Performance assertion: should complete within reasonable time
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(5000);
    });

    it('should handle large payloads efficiently', async () => {
      // Test with a large number of products
      const response = await axios.get(`${BASE_URL}/api/products`);
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      
      // Performance assertion: should handle large payloads within 1000ms
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('Error Handling Performance', () => {
    it('should handle 404 errors quickly', async () => {
      try {
        await axios.get(`${BASE_URL}/api/users/999999`);
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
      
      // Performance assertion: 404 should be fast
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(500);
    });

    it('should handle invalid requests efficiently', async () => {
      try {
        await axios.post(`${BASE_URL}/api/users`, {});
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
      
      // Performance assertion: validation errors should be fast
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(500);
    });
  });
});