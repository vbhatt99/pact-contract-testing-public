// Advanced contract validation utilities

const Ajv = require('ajv');
const addFormats = require('ajv-formats');

class ContractValidator {
  constructor() {
    this.ajv = new Ajv({ allErrors: true });
    addFormats(this.ajv);
    this.schemas = new Map();
    this.setupSchemas();
  }

  setupSchemas() {
    // User schemas
    this.schemas.set('user', {
      type: 'object',
      properties: {
        id: { type: 'integer', minimum: 1 },
        name: { type: 'string', minLength: 1, maxLength: 100 },
        email: { type: 'string', format: 'email' },
        createdAt: { type: 'string', format: 'date-time' },
        isActive: { type: 'boolean' }
      },
      required: ['id', 'name', 'email', 'createdAt', 'isActive'],
      additionalProperties: false
    });

    this.schemas.set('userList', {
      type: 'array',
      items: { $ref: '#/definitions/user' },
      minItems: 1
    });

    // Product schemas
    this.schemas.set('product', {
      type: 'object',
      properties: {
        id: { type: 'integer', minimum: 1 },
        name: { type: 'string', minLength: 1, maxLength: 200 },
        price: { type: 'number', minimum: 0 },
        description: { type: 'string', maxLength: 1000 },
        category: { type: 'string', minLength: 1 },
        inStock: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' }
      },
      required: ['id', 'name', 'price', 'category', 'inStock', 'createdAt'],
      additionalProperties: false
    });

    this.schemas.set('productList', {
      type: 'array',
      items: { $ref: '#/definitions/product' },
      minItems: 1
    });

    // Order schemas
    this.schemas.set('orderItem', {
      type: 'object',
      properties: {
        productId: { type: 'integer', minimum: 1 },
        quantity: { type: 'integer', minimum: 1 },
        price: { type: 'number', minimum: 0 }
      },
      required: ['productId', 'quantity', 'price'],
      additionalProperties: false
    });

    this.schemas.set('order', {
      type: 'object',
      properties: {
        id: { type: 'integer', minimum: 1 },
        userId: { type: 'integer', minimum: 1 },
        products: {
          type: 'array',
          items: { $ref: '#/definitions/orderItem' },
          minItems: 1
        },
        total: { type: 'number', minimum: 0 },
        status: { 
          type: 'string', 
          enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] 
        },
        createdAt: { type: 'string', format: 'date-time' }
      },
      required: ['id', 'userId', 'products', 'total', 'status', 'createdAt'],
      additionalProperties: false
    });

    this.schemas.set('orderList', {
      type: 'array',
      items: { $ref: '#/definitions/order' },
      minItems: 1
    });

    // Error schemas
    this.schemas.set('error', {
      type: 'object',
      properties: {
        error: { type: 'string', minLength: 1 },
        message: { type: 'string', minLength: 1 },
        statusCode: { type: 'integer', minimum: 400, maximum: 599 }
      },
      required: ['error', 'message', 'statusCode'],
      additionalProperties: false
    });

    // Compile all schemas
    this.schemas.forEach((schema, name) => {
      this.ajv.addSchema(schema, name);
    });
  }

  validate(schemaName, data) {
    const validate = this.ajv.getSchema(schemaName);
    if (!validate) {
      throw new Error(`Schema not found: ${schemaName}`);
    }

    const isValid = validate(data);
    if (!isValid) {
      return {
        valid: false,
        errors: validate.errors
      };
    }

    return { valid: true };
  }

  validateUser(user) {
    return this.validate('user', user);
  }

  validateUserList(users) {
    return this.validate('userList', users);
  }

  validateProduct(product) {
    return this.validate('product', product);
  }

  validateProductList(products) {
    return this.validate('productList', products);
  }

  validateOrder(order) {
    return this.validate('order', order);
  }

  validateOrderList(orders) {
    return this.validate('orderList', orders);
  }

  validateError(error) {
    return this.validate('error', error);
  }

  // Advanced validation methods
  validateContractCompatibility(consumerContract, providerContract) {
    // This would implement contract compatibility validation
    console.log('Validating contract compatibility...');
    return { compatible: true };
  }

  validateBackwardCompatibility(oldContract, newContract) {
    // This would implement backward compatibility validation
    console.log('Validating backward compatibility...');
    return { backwardCompatible: true };
  }

  generateValidationReport(contracts) {
    const report = {
      timestamp: new Date().toISOString(),
      contracts: [],
      summary: {
        total: contracts.length,
        valid: 0,
        invalid: 0,
        warnings: []
      }
    };

    contracts.forEach(contract => {
      const validation = this.validateContract(contract);
      report.contracts.push(validation);
      
      if (validation.valid) {
        report.summary.valid++;
      } else {
        report.summary.invalid++;
      }
    });

    return report;
  }

  validateContract(contract) {
    // This would implement comprehensive contract validation
    return {
      name: contract.name,
      valid: true,
      errors: [],
      warnings: []
    };
  }
}

module.exports = ContractValidator;
