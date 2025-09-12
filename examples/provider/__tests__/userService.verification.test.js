const { Verifier } = require('@pact-foundation/pact');
const path = require('path');
const app = require('../server');

describe('User Service Provider Verification', () => {
  // Use external server instead of starting our own
  // The server is managed by the CI test runner

  it('should verify the user service contracts', async () => {
    const opts = {
      provider: 'UserServiceProvider',
      providerBaseUrl: 'http://localhost:3001',
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
        },
        'no users exist': () => {
          // In a real scenario, you might clear the database
          return Promise.resolve();
        }
      },
      requestFilter: (req, res, next) => {
        // Add any request filtering if needed
        next();
      },
      validateSSL: false,
      changeOrigin: true
    };

    return new Verifier(opts).verifyProvider().then(output => {
      console.log('Pact Verification Complete!');
      console.log(output);
    });
  });
});
