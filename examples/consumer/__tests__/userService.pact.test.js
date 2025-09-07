const { Pact } = require('@pact-foundation/pact');
const path = require('path');
const UserService = require('../userService');
const { userMatcher, userListMatcher, errorMatcher } = require('../../shared/matchers');

describe('User Service PACT', () => {
  let provider;
  let userService;

  beforeAll(() => {
    // Use unique port for this test file to avoid conflicts
    const port = process.env.PACT_PORT || 3002;
    provider = new Pact({
      consumer: 'UserServiceConsumer',
      provider: 'UserServiceProvider',
      port: parseInt(port),
      log: path.resolve(process.cwd(), 'logs', 'userService-pact.log'),
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

  describe('GET /api/users', () => {
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
            body: userListMatcher
          }
        });

      // Act
      const users = await userService.getAllUsers();

      // Assert
      expect(users).toBeDefined();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a specific user', async () => {
      // Arrange
      const userId = 1;

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
            body: userMatcher
          }
        });

      // Act
      const user = await userService.getUserById(userId);

      // Assert
      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(typeof user.id).toBe('number');
    });

    it('should return 404 when user does not exist', async () => {
      // Arrange
      const userId = 999;

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
            body: errorMatcher
          }
        });

      // Act & Assert
      await expect(userService.getUserById(userId)).rejects.toThrow('User not found');
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      // Arrange
      const newUser = {
        name: 'Jane Doe',
        email: 'jane@example.com'
      };

      await provider
        .addInteraction({
          states: [{ description: 'no users exist' }],
          uponReceiving: 'a request to create a new user',
          withRequest: {
            method: 'POST',
            path: '/api/users',
            headers: { 'Content-Type': 'application/json' },
            body: newUser
          },
          willRespondWith: {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
            body: userMatcher
          }
        });

      // Act
      const createdUser = await userService.createUser(newUser);

      // Assert
      expect(createdUser).toBeDefined();
      expect(createdUser.name).toBeDefined();
      expect(createdUser.email).toBeDefined();
      expect(typeof createdUser.name).toBe('string');
      expect(typeof createdUser.email).toBe('string');
    });

    it('should return 400 for invalid user data', async () => {
      // Arrange
      const invalidUser = {
        name: 'Jane Doe'
        // missing email
      };

      await provider
        .addInteraction({
          states: [{ description: 'no users exist' }],
          uponReceiving: 'a request to create a user with invalid data',
          withRequest: {
            method: 'POST',
            path: '/api/users',
            headers: { 'Content-Type': 'application/json' },
            body: invalidUser
          },
          willRespondWith: {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
            body: errorMatcher
          }
        });

      // Act & Assert
      await expect(userService.createUser(invalidUser)).rejects.toThrow('Invalid user data');
    });
  });
});
