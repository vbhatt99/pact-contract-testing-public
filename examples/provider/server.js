const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock data
let users = [
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

let products = [
  {
    id: 1,
    name: 'Laptop',
    price: 999.99,
    description: 'High-performance laptop',
    category: 'electronics',
    inStock: true,
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Smartphone',
    price: 699.99,
    description: 'Latest smartphone model',
    category: 'electronics',
    inStock: true,
    createdAt: '2023-01-01T00:00:00Z'
  }
];

let orders = [
  {
    id: 1,
    userId: 1,
    products: [
      { productId: 1, quantity: 1, price: 999.99 }
    ],
    total: 999.99,
    status: 'pending',
    createdAt: '2023-01-01T00:00:00Z'
  }
];

// User endpoints
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({
      error: 'UserNotFound',
      message: 'User not found',
      statusCode: 404
    });
  }
  res.json(user);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({
      error: 'ValidationError',
      message: 'Name and email are required',
      statusCode: 400
    });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email,
    createdAt: new Date().toISOString().split('.')[0] + 'Z',
    isActive: true
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// Product endpoints
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({
      error: 'ProductNotFound',
      message: 'Product not found',
      statusCode: 404
    });
  }
  res.json(product);
});

// Order endpoints
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) {
    return res.status(404).json({
      error: 'OrderNotFound',
      message: 'Order not found',
      statusCode: 404
    });
  }
  res.json(order);
});

app.post('/api/orders', (req, res) => {
  const { userId, products: orderProducts } = req.body;
  
  if (!userId || !orderProducts || !Array.isArray(orderProducts)) {
    return res.status(400).json({
      error: 'ValidationError',
      message: 'User ID and products array are required',
      statusCode: 400
    });
  }
  
  // Calculate total
  const total = orderProducts.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  
  const newOrder = {
    id: orders.length + 1,
    userId,
    products: orderProducts.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: products.find(p => p.id === item.productId)?.price || 0
    })),
    total,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'InternalServerError',
    message: 'Something went wrong',
    statusCode: 500
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'NotFound',
    message: 'Endpoint not found',
    statusCode: 404
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Provider server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
}

module.exports = app;
