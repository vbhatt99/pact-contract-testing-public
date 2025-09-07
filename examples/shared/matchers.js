// PACT matchers for consistent contract testing

const { Matchers } = require('@pact-foundation/pact');

const {
  like,
  eachLike,
  term,
  iso8601DateTime,
  iso8601Date,
  decimal,
  integer,
  boolean,
  string
} = Matchers;

// User matchers
const userMatcher = {
  id: integer(),
  name: string(),
  email: term({
    matcher: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    generate: 'user@example.com'
  }),
  createdAt: iso8601DateTime(),
  isActive: boolean()
};

const userListMatcher = eachLike(userMatcher, { min: 1 });

// Product matchers
const productMatcher = {
  id: integer(),
  name: string(),
  price: decimal(),
  description: like('A great product'),
  category: like('electronics'),
  inStock: boolean(),
  createdAt: iso8601DateTime()
};

const productListMatcher = eachLike(productMatcher, { min: 1 });

// Order matchers
const orderItemMatcher = {
  productId: integer(),
  quantity: integer(),
  price: decimal()
};

const orderMatcher = {
  id: integer(),
  userId: integer(),
  products: eachLike(orderItemMatcher, { min: 1 }),
  total: decimal(),
  status: term({
    matcher: 'pending|confirmed|shipped|delivered|cancelled',
    generate: 'pending'
  }),
  createdAt: iso8601DateTime()
};

const orderListMatcher = eachLike(orderMatcher, { min: 1 });

// Error matchers
const errorMatcher = {
  error: string(),
  message: string(),
  statusCode: integer()
};

module.exports = {
  userMatcher,
  userListMatcher,
  productMatcher,
  productListMatcher,
  orderMatcher,
  orderListMatcher,
  orderItemMatcher,
  errorMatcher
};
