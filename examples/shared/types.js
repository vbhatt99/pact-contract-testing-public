// Shared types and schemas for PACT contracts

const UserSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    createdAt: { type: 'string', format: 'date-time' },
    isActive: { type: 'boolean' }
  },
  required: ['id', 'name', 'email', 'createdAt', 'isActive']
};

const ProductSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    price: { type: 'number' },
    description: { type: 'string' },
    category: { type: 'string' },
    inStock: { type: 'boolean' },
    createdAt: { type: 'string', format: 'date-time' }
  },
  required: ['id', 'name', 'price', 'category', 'inStock', 'createdAt']
};

const OrderSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    userId: { type: 'integer' },
    products: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          productId: { type: 'integer' },
          quantity: { type: 'integer' },
          price: { type: 'number' }
        },
        required: ['productId', 'quantity', 'price']
      }
    },
    total: { type: 'number' },
    status: { type: 'string', enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] },
    createdAt: { type: 'string', format: 'date-time' }
  },
  required: ['id', 'userId', 'products', 'total', 'status', 'createdAt']
};

const ErrorSchema = {
  type: 'object',
  properties: {
    error: { type: 'string' },
    message: { type: 'string' },
    statusCode: { type: 'integer' }
  },
  required: ['error', 'message', 'statusCode']
};

module.exports = {
  UserSchema,
  ProductSchema,
  OrderSchema,
  ErrorSchema
};
