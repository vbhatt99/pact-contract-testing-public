const axios = require('axios');

class OrderService {
  constructor(baseURL = 'http://localhost:3001') {
    this.client = axios.create({
      baseURL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async getAllOrders() {
    try {
      const response = await this.client.get('/api/orders');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }
  }

  async getOrderById(id) {
    try {
      const response = await this.client.get(`/api/orders/${id}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error('Order not found');
      }
      throw new Error(`Failed to fetch order: ${error.message}`);
    }
  }

  async createOrder(orderData) {
    try {
      const response = await this.client.post('/api/orders', orderData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error('Invalid order data');
      }
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }
}

module.exports = OrderService;
