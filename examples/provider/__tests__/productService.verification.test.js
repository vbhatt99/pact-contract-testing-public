const { Verifier } = require('@pact-foundation/pact');
const path = require('path');
const app = require('../server');

describe('Product Service Provider Verification', () => {
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

  it('should verify the product service contracts', async () => {
    const opts = {
      provider: 'ProductServiceProvider',
      providerBaseUrl: 'http://localhost:3001',
      pactUrls: [path.resolve(process.cwd(), 'pacts', 'productserviceconsumer-productserviceprovider.json')],
      stateHandlers: {
        'products exist': () => {
          // Mock data is already set up in the server
          return Promise.resolve();
        },
        'product with id 1 exists': () => {
          // Mock data is already set up in the server
          return Promise.resolve();
        },
        'product with id 999 does not exist': () => {
          // Mock data is already set up in the server
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

    return new Verifier().verifyProvider(opts).then(output => {
      console.log('Pact Verification Complete!');
      console.log(output);
    });
  });
});
