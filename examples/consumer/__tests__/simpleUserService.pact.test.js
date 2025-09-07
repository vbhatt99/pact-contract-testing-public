const { Pact } = require('@pact-foundation/pact');
const path = require('path');
const UserService = require('../userService');

describe('Simple User Service PACT', () => {
  let provider;
  let userService;

  beforeAll(() => {
    provider = new Pact({
      consumer: 'UserServiceConsumer',
      provider: 'UserServiceProvider',
      port: 3002,
      log: path.resolve(process.cwd(), 'logs', 'pact.log'),
      dir: path.resolve(process.cwd(), 'pacts'),
      logLevel: 'INFO',
      spec: 2
    });

    return provider.setup();
  });

  beforeEach(() => {
    userService = new UserService(provider.mockService.baseUrl);
  });

  afterEach(() => {
    provider.verify();
  });

  afterAll(() => {
    return provider.finalize();
  });

  it('should return a list of users', async () => {
    // Arrange
    await provider
      .addInteraction({
        states: [{ description: 'users exist' }],
        uponReceiving: 'a request for all users',
        withRequest: {
          method: 'GET',
          path: '/api/users'
        },
        willRespondWith: {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: [
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
          ]
        }
      });

    // Act
    const users = await userService.getAllUsers();

    // Assert
    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
    expect(users[0].name).toBe('John Doe');
  });

  it('should return a specific user', async () => {
    // Arrange
    await provider
      .addInteraction({
        states: [{ description: 'user with id 1 exists' }],
        uponReceiving: 'a request for user with id 1',
        withRequest: {
          method: 'GET',
          path: '/api/users/1'
        },
        willRespondWith: {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            createdAt: '2023-01-01T00:00:00Z',
            isActive: true
          }
        }
      });

    // Act
    const user = await userService.getUserById(1);

    // Assert
    expect(user).toBeDefined();
    expect(user.id).toBe(1);
    expect(user.name).toBe('John Doe');
  });

  it('should return 404 when user does not exist', async () => {
    // Arrange
    await provider
      .addInteraction({
        states: [{ description: 'user with id 999 does not exist' }],
        uponReceiving: 'a request for non-existent user',
        withRequest: {
          method: 'GET',
          path: '/api/users/999'
        },
        willRespondWith: {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
          body: {
            error: 'UserNotFound',
            message: 'User not found',
            statusCode: 404
          }
        }
      });

    // Act & Assert
    await expect(userService.getUserById(999)).rejects.toThrow('User not found');
  });
});
