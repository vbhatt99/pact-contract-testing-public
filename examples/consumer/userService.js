const axios = require('axios');

class UserService {
  constructor(baseURL = 'http://localhost:3001') {
    this.client = axios.create({
      baseURL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async getAllUsers() {
    try {
      const response = await this.client.get('/api/users');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  async getUserById(id) {
    try {
      const response = await this.client.get(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error('User not found');
      }
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  async createUser(userData) {
    try {
      const response = await this.client.post('/api/users', userData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error('Invalid user data');
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
}

module.exports = UserService;
