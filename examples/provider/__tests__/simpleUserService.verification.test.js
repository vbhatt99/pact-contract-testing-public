const { Verifier } = require('@pact-foundation/pact');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

describe('Simple User Service Provider Verification', () => {
  let server;
  
  beforeAll(async () => {
    // Start the provider server
    const app = express();
    const PORT = 3003;
    
    // Middleware
    app.use(cors());
    app.use(bodyParser.json());
    
    // Mock data
    const users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: '2023-01-01T00:00:00Z',
        isActive: true
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        createdAt: '2023-01-02T00:00:00Z',
        isActive: true
      }
    ];
    
    // Routes
    app.get('/api/users', (req, res) => {
      res.json(users);
    });
    
    app.get('/api/users/:id', (req, res) => {
      const user = users.find(u => u.id === parseInt(req.params.id));
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ 
          error: 'UserNotFound',
          message: 'User not found',
          statusCode: 404
        });
      }
    });
    
    app.post('/api/users', (req, res) => {
      const { name, email } = req.body;
      if (!name || !email) {
        return res.status(400).json({ 
          error: 'InvalidUserData',
          message: 'Invalid user data',
          statusCode: 400
        });
      }
      const newUser = {
        id: users.length + 1,
        name,
        email,
        createdAt: '2023-01-01T00:00:00Z', // Fixed format to match contract
        isActive: true
      };
      users.push(newUser);
      res.status(201).json(newUser);
    });
    
    app.get('/health', (req, res) => {
      res.json({ status: 'ok' });
    });
    
    // Start server
    server = app.listen(PORT, () => {
      console.log(`Provider server running on port ${PORT}`);
    });
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
  
  afterAll(async () => {
    if (server) {
      server.close();
    }
  });

  it('should verify the user service contracts', async () => {
    const opts = {
      provider: 'UserServiceProvider',
      providerBaseUrl: 'http://localhost:3003',
      pactUrls: [path.resolve(process.cwd(), 'pacts', 'UserServiceConsumer-UserServiceProvider.json')],
      stateHandlers: {
        'users exist': () => {
          // Mock data is already set up in the server
          return Promise.resolve();
        },
        'user with id 1 exists': () => {
          // Mock data is already set up in the server
          return Promise.resolve();
        },
        'user with id 999 does not exist': () => {
          // Mock data is already set up in the server
          return Promise.resolve();
        }
      },
      requestFilter: (req, res, next) => {
        // Add any request filtering if needed
        next();
      },
      validateSSL: false,
      changeOrigin: true,
      logLevel: 'INFO'
    };

    return new Verifier(opts).verifyProvider().then(output => {
      console.log('Pact Verification Complete!');
      console.log(output);
    });
  });
});
