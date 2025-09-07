const { Verifier } = require('@pact-foundation/pact');
const path = require('path');

describe('Simple User Service Provider Verification', () => {
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
