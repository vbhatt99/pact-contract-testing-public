const axios = require('axios');

class ProductService {
  constructor(baseURL = 'http://localhost:3001') {
    this.client = axios.create({
      baseURL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async getAllProducts() {
    try {
      const response = await this.client.get('/api/products');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      const response = await this.client.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error(`Failed to fetch product: ${error.message}`);
    }
  }
}

module.exports = ProductService;
