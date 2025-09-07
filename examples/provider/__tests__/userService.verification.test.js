const { Verifier } = require('@pact-foundation/pact');
const path = require('path');
const app = require('../server');

describe('User Service Provider Verification', () => {
  let server;

  beforeAll(() => {
    server = app.listen(3001, () => {
      console.log('Provider server started for verification');
    });
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
  });

  it('should verify the user service contracts', async () => {
    const opts = {
      provider: 'UserServiceProvider',
      providerBaseUrl: 'http://localhost:3001',
      pactUrls: [path.resolve(process.cwd(), 'pacts', 'userserviceconsumer-userserviceprovider.json')],
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
