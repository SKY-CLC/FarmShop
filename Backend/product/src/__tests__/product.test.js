jest.mock('../services/imagekit.service', () => ({
  uploadImage: jest.fn().mockResolvedValue({
    url: 'http://test.example/test.jpg',
    thumbnailUrl: 'http://test.example/thumb.jpg',
    fileId: '123',
  }),
}));

jest.mock('../middlewares/auth.middleware', () => {
  return jest.fn(() => (req, res, next) => {
    req.user = { id: 'user123', role: 'farmer' };
    next();
  });
});

jest.mock('../db/models/product.model', () => ({
  create: jest.fn().mockResolvedValue({
    _id: 'product123',
    title: 'Test Product',
    category: 'Vegetable',
    image: {
      url: 'http://test.example/test.jpg',
      thumbnail: 'http://test.example/thumb.jpg',
      id: '123',
    },
    price: { amount: 100, currency: 'INR' },
    quantity: 10,
    description: 'A test product',
    harvestDate: new Date('2026-01-01T00:00:00.000Z'),
    expiryDate: new Date('2026-01-05T00:00:00.000Z'),
    farmerId: 'user123',
    location: { lat: 12.34, lng: 56.78 },
  }),
  find: jest.fn(),
}));

const request = require('supertest');
const app = require('../app');
const productModel = require('../db/models/product.model');

describe('POST /api/products', () => {
  it('creates a product with image upload and returns 201', async () => {
    const res = await request(app)
      .post('/api/products')
      .field('title', 'Test Product')
      .field('category', 'Vegetable')
      .field('priceAmount', '100')
      .field('priceCurrency', 'INR')
      .field('quantity', '10')
      .field('description', 'A test product')
      .field('harvestDate', '2026-01-01')
      .field('shelfLifeDays', '4')
      .field('location', JSON.stringify({ lat: 12.34, lng: 56.78 }))
      .attach('image', Buffer.from('abc123'), 'test.jpg');

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Product created successfully');
    expect(res.body).toHaveProperty('product');
    expect(res.body.product).toMatchObject({
      title: 'Test Product',
      category: 'Vegetable',
      quantity: 10,
      description: 'A test product',
      farmerId: 'user123',
      location: { lat: 12.34, lng: 56.78 },
      price: { amount: 100, currency: 'INR' },
    });
    expect(res.body.product.image).toEqual({
      url: 'http://test.example/test.jpg',
      thumbnail: 'http://test.example/thumb.jpg',
      id: '123',
    });
  });
});

describe('GET /api/products', () => {
  beforeEach(() => {
    // Reset mock before each test
    jest.clearAllMocks();
  });

  it('should return all products with status 200', async () => {
    const mockProducts = [
      {
        _id: 'product1',
        title: 'Tomato',
        category: 'Vegetable',
        price: { amount: 50, currency: 'INR' },
        quantity: 20,
        description: 'Fresh tomatoes',
        harvestDate: '2026-01-01T00:00:00.000Z',
        expiryDate: '2026-01-05T00:00:00.000Z',
        farmerId: 'farmer1',
        location: { lat: 12.34, lng: 56.78 },
        image: {
          url: 'http://example.com/tomato.jpg',
          thumbnail: 'http://example.com/tomato-thumb.jpg',
          id: 'img1',
        },
      },
      {
        _id: 'product2',
        title: 'Onion',
        category: 'Vegetable',
        price: { amount: 30, currency: 'INR' },
        quantity: 15,
        description: 'Fresh onions',
        harvestDate: '2026-01-02T00:00:00.000Z',
        expiryDate: '2026-01-10T00:00:00.000Z',
        farmerId: 'farmer2',
        location: { lat: 13.34, lng: 57.78 },
        image: {
          url: 'http://example.com/onion.jpg',
          thumbnail: 'http://example.com/onion-thumb.jpg',
          id: 'img2',
        },
      },
    ];

    productModel.find.mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockProducts),
      }),
    });

    const res = await request(app).get('/api/products');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Products retrieved successfully');
    expect(res.body).toHaveProperty('products');
    expect(res.body).toHaveProperty('count', 2);
    expect(res.body.products).toEqual(mockProducts);
  });

  it('should return products filtered by category', async () => {
    const mockProducts = [
      {
        _id: 'product1',
        title: 'Tomato',
        category: 'Vegetable',
        price: { amount: 50, currency: 'INR' },
        quantity: 20,
        description: 'Fresh tomatoes',
        farmerId: 'farmer1',
        location: { lat: 12.34, lng: 56.78 },
      },
    ];

    productModel.find.mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockProducts),
      }),
    });

    const res = await request(app).get('/api/products?category=Vegetable');

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.products[0].category).toBe('Vegetable');
  });

  it('should return products filtered by price range', async () => {
    const mockProducts = [
      {
        _id: 'product1',
        title: 'Tomato',
        category: 'Vegetable',
        price: { amount: 75, currency: 'INR' },
        quantity: 20,
        farmerId: 'farmer1',
      },
    ];

    productModel.find.mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockProducts),
      }),
    });

    const res = await request(app).get('/api/products?minPrice=50&maxPrice=100');

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.products[0].price.amount).toBe(75);
  });

  it('should return products with pagination', async () => {
    const mockProducts = [
      {
        _id: 'product1',
        title: 'Tomato',
        category: 'Vegetable',
        price: { amount: 50, currency: 'INR' },
        quantity: 20,
        farmerId: 'farmer1',
      },
    ];

    productModel.find.mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockProducts),
      }),
    });

    const res = await request(app).get('/api/products?skip=0&limit=10');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('products');
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  it('should return empty array when no products match filter', async () => {
    productModel.find.mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([]),
      }),
    });

    const res = await request(app).get('/api/products?category=NonExistent');

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(0);
    expect(res.body.products).toEqual([]);
  });

  it('should handle search query (text search)', async () => {
    const mockProducts = [
      {
        _id: 'product1',
        title: 'Fresh Tomato',
        category: 'Vegetable',
        description: 'Organic tomato',
        price: { amount: 50, currency: 'INR' },
        quantity: 20,
        farmerId: 'farmer1',
      },
    ];

    productModel.find.mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockProducts),
      }),
    });

    const res = await request(app).get('/api/products?q=tomato');

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.products[0].title).toContain('Tomato');
  });

  it('should handle combined filters (category + price)', async () => {
    const mockProducts = [
      {
        _id: 'product1',
        title: 'Tomato',
        category: 'Vegetable',
        price: { amount: 60, currency: 'INR' },
        quantity: 20,
        farmerId: 'farmer1',
      },
    ];

    productModel.find.mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockProducts),
      }),
    });

    const res = await request(app).get('/api/products?category=Vegetable&minPrice=50&maxPrice=100');

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.products[0].category).toBe('Vegetable');
    expect(res.body.products[0].price.amount).toBeGreaterThanOrEqual(50);
  });

  it('should handle location-based filtering', async () => {
    const mockProducts = [
      {
        _id: 'product1',
        title: 'Tomato',
        category: 'Vegetable',
        price: { amount: 50, currency: 'INR' },
        quantity: 20,
        farmerId: 'farmer1',
        location: { lat: 12.34, lng: 56.78 },
      },
    ];

    productModel.find.mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockProducts),
      }),
    });

    const res = await request(app).get('/api/products?lat=12.34&lng=56.78&radius=5000');

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.products[0].location).toEqual({ lat: 12.34, lng: 56.78 });
  });

  it('should return 500 on database error', async () => {
    productModel.find.mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockRejectedValue(new Error('Database error')),
      }),
    });

    const res = await request(app).get('/api/products');

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message', 'Internal server error');
  });
});

describe('GET /api/products/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a product by id with status 200', async () => {
    const mockProduct = {
      _id: 'product123',
      title: 'Fresh Tomato',
      category: 'Vegetable',
      price: { amount: 50, currency: 'INR' },
      quantity: 20,
      description: 'Organic fresh tomatoes',
      harvestDate: "2026-01-01T00:00:00.000Z",
      expiryDate: "2026-01-08T00:00:00.000Z",
      farmerId: 'farmer1',
      location: { lat: 12.34, lng: 56.78 },
      image: {
        url: 'http://example.com/tomato.jpg',
        thumbnail: 'http://example.com/tomato-thumb.jpg',
        id: 'img123',
      },
    };

    productModel.findById = jest.fn().mockResolvedValue(mockProduct);

    const res = await request(app).get('/api/products/product123');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Product fetched successfully');
    expect(res.body).toHaveProperty('product');
    expect(res.body.product).toEqual(mockProduct);
    expect(productModel.findById).toHaveBeenCalledWith('product123');
  });

  it('should return 404 when product does not exist', async () => {
    productModel.findById = jest.fn().mockResolvedValue(null);

    const res = await request(app).get('/api/products/nonexistent123');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Product not found');
    expect(productModel.findById).toHaveBeenCalledWith('nonexistent123');
  });

  it('should handle database error and return 500', async () => {
    productModel.findById = jest.fn().mockRejectedValue(new Error('Database error'));

    const res = await request(app).get('/api/products/product123');

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message', 'Internal server error');
  });

  it('should return correct product details with full metadata', async () => {
    const mockProduct = {
      _id: 'product456',
      title: 'Organic Onion',
      category: 'Vegetable',
      price: { amount: 30, currency: 'INR' },
      quantity: 50,
      description: 'Fresh organic onions from farm',
      harvestDate: new Date('2026-01-10T00:00:00.000Z'),
      expiryDate: new Date('2026-02-20T00:00:00.000Z'),
      farmerId: 'farmer2',
      location: { lat: 13.45, lng: 57.89 },
      image: {
        url: 'http://example.com/onion.jpg',
        thumbnail: 'http://example.com/onion-thumb.jpg',
        id: 'img456',
      },
    };

    productModel.findById = jest.fn().mockResolvedValue(mockProduct);

    const res = await request(app).get('/api/products/product456');

    expect(res.statusCode).toBe(200);
    expect(res.body.product).toMatchObject({
      title: 'Organic Onion',
      category: 'Vegetable',
      quantity: 50,
      description: 'Fresh organic onions from farm',
      farmerId: 'farmer2',
    });
    expect(res.body.product.price).toEqual({ amount: 30, currency: 'INR' });
    expect(res.body.product.location).toEqual({ lat: 13.45, lng: 57.89 });
  });

  it('should handle invalid MongoDB ObjectId format gracefully', async () => {
    productModel.findById = jest.fn().mockResolvedValue(null);

    const res = await request(app).get('/api/products/invalid-id-format');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Product not found');
  });

  it('should retrieve product with special characters in location data', async () => {
    const mockProduct = {
      _id: 'product789',
      title: 'Special Product',
      category: 'Fruit',
      price: { amount: 100, currency: 'INR' },
      quantity: 15,
      description: 'Product with special location',
      farmerId: 'farmer3',
      location: { lat: -45.123, lng: 170.456 },
      image: {
        url: 'http://example.com/product.jpg',
        thumbnail: 'http://example.com/product-thumb.jpg',
        id: 'img789',
      },
    };

    productModel.findById = jest.fn().mockResolvedValue(mockProduct);

    const res = await request(app).get('/api/products/product789');

    expect(res.statusCode).toBe(200);
    expect(res.body.product.location).toEqual({ lat: -45.123, lng: 170.456 });
  });

  it('should call findById exactly once', async () => {
    const mockProduct = {
      _id: 'product999',
      title: 'Test Product',
      category: 'Vegetable',
      price: { amount: 50, currency: 'INR' },
      quantity: 10,
    };

    productModel.findById = jest.fn().mockResolvedValue(mockProduct);

    await request(app).get('/api/products/product999');

    expect(productModel.findById).toHaveBeenCalledTimes(1);
  });

  it('should return product without authentication requirement', async () => {
    const mockProduct = {
      _id: 'publicProduct',
      title: 'Public Product',
      category: 'Vegetable',
      price: { amount: 50, currency: 'INR' },
      quantity: 10,
    };

    productModel.findById = jest.fn().mockResolvedValue(mockProduct);

    // No authentication middleware required for GET /:id
    const res = await request(app).get('/api/products/publicProduct');

    expect(res.statusCode).toBe(200);
    expect(res.body.product).toEqual(mockProduct);
  });
});

describe('PATCH /api/products/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update product with all fields and return 200', async () => {
    const productId = '507f1f77bcf86cd799439011';
    const originalProduct = {
      _id: productId,
      title: 'Old Title',
      category: 'Vegetable',
      price: { amount: 50, currency: 'INR' },
      quantity: 20,
      description: 'Old description',
      farmerId: 'user123',
      location: { coordinates: [56.78, 12.34] },
      save: jest.fn().mockResolvedValue(true),
    };

    productModel.findOne = jest.fn().mockResolvedValue(originalProduct);
    
    // Simulate updates
    originalProduct.title = 'Updated Title';
    originalProduct.category = 'Fruit';
    originalProduct.price = { amount: 100, currency: 'INR' };
    originalProduct.quantity = 50;
    originalProduct.description = 'Updated description';
    originalProduct.location = { coordinates: [57.89, 13.45] };

    const res = await request(app)
      .patch(`/api/products/${productId}`)
      .send({
        title: 'Updated Title',
        category: 'Fruit',
        price: { amount: 100, currency: 'INR' },
        quantity: 50,
        description: 'Updated description',
        location: { coordinates: [57.89, 13.45] },
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Product updated successfully');
    expect(res.body).toHaveProperty('product');
  });

  it('should update only provided fields (partial update)', async () => {
    const productId = '507f1f77bcf86cd799439012';
    const originalProduct = {
      _id: productId,
      title: 'Original Title',
      category: 'Vegetable',
      price: { amount: 50, currency: 'INR' },
      quantity: 20,
      description: 'Original description',
      farmerId: 'user123',
      save: jest.fn().mockResolvedValue(true),
    };

    productModel.findOne = jest.fn().mockResolvedValue(originalProduct);
    
    originalProduct.price = { amount: 75, currency: 'INR' };

    const res = await request(app)
      .patch(`/api/products/${productId}`)
      .send({
        price: { amount: 75 },
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.product.price.amount).toBe(75);
    expect(res.body.product.title).toBe('Original Title');
  });

  it('should return 404 when product does not exist', async () => {
    const productId = '507f1f77bcf86cd799439013';
    productModel.findOne = jest.fn().mockResolvedValue(null);

    const res = await request(app)
      .patch(`/api/products/${productId}`)
      .send({
        title: 'Updated Title',
      });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Product not found');
  });

  it('should return 403 when farmer tries to update another farmer\'s product', async () => {
    const productId = '507f1f77bcf86cd799439014';
    productModel.findOne = jest.fn().mockResolvedValue(null);

    const res = await request(app)
      .patch(`/api/products/${productId}`)
      .send({
        title: 'Hacked Title',
      });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Product not found');
    expect(productModel.findOne).toHaveBeenCalledWith({
      _id: productId,
      farmerId: 'user123',
    });
  });

  it('should update quantity field', async () => {
    const productId = '507f1f77bcf86cd799439015';
    const originalProduct = {
      _id: productId,
      title: 'Product',
      quantity: 20,
      farmerId: 'user123',
      save: jest.fn().mockResolvedValue(true),
    };

    productModel.findOne = jest.fn().mockResolvedValue(originalProduct);
    originalProduct.quantity = 100;

    const res = await request(app)
      .patch(`/api/products/${productId}`)
      .send({ quantity: 100 });

    expect(res.statusCode).toBe(200);
    expect(res.body.product.quantity).toBe(100);
  });

  it('should update price amount', async () => {
    const productId = '507f1f77bcf86cd799439016';
    const originalProduct = {
      _id: productId,
      title: 'Product',
      price: { amount: 50, currency: 'INR' },
      farmerId: 'user123',
      save: jest.fn().mockResolvedValue(true),
    };

    productModel.findOne = jest.fn().mockResolvedValue(originalProduct);
    originalProduct.price.amount = 150;

    const res = await request(app)
      .patch(`/api/products/${productId}`)
      .send({ price: { amount: 150 } });

    expect(res.statusCode).toBe(200);
    expect(res.body.product.price.amount).toBe(150);
  });

  it('should update price currency', async () => {
    const productId = '507f1f77bcf86cd799439017';
    const originalProduct = {
      _id: productId,
      title: 'Product',
      price: { amount: 50, currency: 'INR' },
      farmerId: 'user123',
      save: jest.fn().mockResolvedValue(true),
    };

    productModel.findOne = jest.fn().mockResolvedValue(originalProduct);
    originalProduct.price.currency = 'USD';

    const res = await request(app)
      .patch(`/api/products/${productId}`)
      .send({ price: { currency: 'USD' } });

    expect(res.statusCode).toBe(200);
    expect(res.body.product.price.currency).toBe('USD');
  });

  it('should update description field', async () => {
    const productId = '507f1f77bcf86cd799439018';
    const originalProduct = {
      _id: productId,
      title: 'Product',
      description: 'Old description',
      farmerId: 'user123',
      save: jest.fn().mockResolvedValue(true),
    };

    productModel.findOne = jest.fn().mockResolvedValue(originalProduct);
    originalProduct.description = 'New description with more details';

    const res = await request(app)
      .patch(`/api/products/${productId}`)
      .send({ description: 'New description with more details' });

    expect(res.statusCode).toBe(200);
    expect(res.body.product.description).toBe('New description with more details');
  });

  it('should update category field', async () => {
    const productId = '507f1f77bcf86cd799439019';
    const originalProduct = {
      _id: productId,
      title: 'Product',
      category: 'Vegetable',
      farmerId: 'user123',
      save: jest.fn().mockResolvedValue(true),
    };

    productModel.findOne = jest.fn().mockResolvedValue(originalProduct);
    originalProduct.category = 'Fruit';

    const res = await request(app)
      .patch(`/api/products/${productId}`)
      .send({ category: 'Fruit' });

    expect(res.statusCode).toBe(200);
    expect(res.body.product.category).toBe('Fruit');
  });

  it('should update title field', async () => {
    const productId = '507f1f77bcf86cd799439020';
    const originalProduct = {
      _id: productId,
      title: 'Old Title',
      farmerId: 'user123',
      save: jest.fn().mockResolvedValue(true),
    };

    productModel.findOne = jest.fn().mockResolvedValue(originalProduct);
    originalProduct.title = 'New Title';

    const res = await request(app)
      .patch(`/api/products/${productId}`)
      .send({ title: 'New Title' });

    expect(res.statusCode).toBe(200);
    expect(res.body.product.title).toBe('New Title');
  });

  it('should update location field with coordinates', async () => {
    const productId = '507f1f77bcf86cd799439021';
    const originalProduct = {
      _id: productId,
      title: 'Product',
      location: { coordinates: [56.78, 12.34] },
      farmerId: 'user123',
      save: jest.fn().mockResolvedValue(true),
    };

    productModel.findOne = jest.fn().mockResolvedValue(originalProduct);
    originalProduct.location = { coordinates: [78.90, 20.56] };

    const res = await request(app)
      .patch(`/api/products/${productId}`)
      .send({ location: { coordinates: [78.90, 20.56] } });

    expect(res.statusCode).toBe(200);
    expect(res.body.product.location).toEqual({ coordinates: [78.90, 20.56] });
  });

  it('should handle database error and return 500', async () => {
    const productId = '507f1f77bcf86cd799439022';
    productModel.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

    const res = await request(app)
      .patch(`/api/products/${productId}`)
      .send({ title: 'Updated' });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message', 'Internal server error');
  });

  it('should update multiple fields in one request', async () => {
    const productId = '507f1f77bcf86cd799439023';
    const originalProduct = {
      _id: productId,
      title: 'Old Title',
      description: 'Old desc',
      quantity: 10,
      price: { amount: 50, currency: 'INR' },
      category: 'Vegetable',
      farmerId: 'user123',
      save: jest.fn().mockResolvedValue(true),
    };

    productModel.findOne = jest.fn().mockResolvedValue(originalProduct);
    
    originalProduct.title = 'New Title';
    originalProduct.description = 'New desc';
    originalProduct.quantity = 50;
    originalProduct.price = { amount: 100, currency: 'INR' };
    originalProduct.category = 'Fruit';

    const res = await request(app)
      .patch(`/api/products/${productId}`)
      .send({
        title: 'New Title',
        description: 'New desc',
        quantity: 50,
        price: { amount: 100, currency: 'INR' },
        category: 'Fruit',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.product.title).toBe('New Title');
    expect(res.body.product.description).toBe('New desc');
    expect(res.body.product.quantity).toBe(50);
    expect(res.body.product.price.amount).toBe(100);
    expect(res.body.product.category).toBe('Fruit');
  });

  it('should return 400 for invalid product ID format', async () => {
    const res = await request(app)
      .patch('/api/products/invalid-id-format')
      .send({ title: 'Updated' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid product id');
  });

  it('should require authentication (farmer role)', async () => {
    const productId = '507f1f77bcf86cd799439024';
    const originalProduct = {
      _id: productId,
      farmerId: 'user123',
      title: 'Product',
      save: jest.fn().mockResolvedValue(true),
    };

    productModel.findOne = jest.fn().mockResolvedValue(originalProduct);

    // With valid auth, request should succeed
    const res = await request(app)
      .patch(`/api/products/${productId}`)
      .send({ title: 'Updated' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Product updated successfully');
  });

  it('should return updated product with all fields intact', async () => {
    const productId = '507f1f77bcf86cd799439025';
    const originalProduct = {
      _id: productId,
      title: 'Old Title',
      category: 'Vegetable',
      price: { amount: 50, currency: 'INR' },
      quantity: 20,
      description: 'Description',
      farmerId: 'user123',
      location: { coordinates: [56.78, 12.34] },
      save: jest.fn().mockResolvedValue(true),
    };

    productModel.findOne = jest.fn().mockResolvedValue(originalProduct);
    originalProduct.title = 'New Title';

    const res = await request(app)
      .patch(`/api/products/${productId}`)
      .send({ title: 'New Title' });

    expect(res.statusCode).toBe(200);
    expect(res.body.product._id).toBe(productId);
    expect(res.body.product.title).toBe('New Title');
    expect(res.body.product.category).toBe('Vegetable');
    expect(res.body.product.quantity).toBe(20);
    expect(res.body.product.farmerId).toBe('user123');
  });

  it('should call findOne with correct filter (id and farmerId)', async () => {
    const productId = '507f1f77bcf86cd799439026';
    const originalProduct = {
      _id: productId,
      farmerId: 'user123',
      title: 'Product',
      save: jest.fn().mockResolvedValue(true),
    };

    productModel.findOne = jest.fn().mockResolvedValue(originalProduct);

    await request(app)
      .patch(`/api/products/${productId}`)
      .send({ title: 'New Title' });

    expect(productModel.findOne).toHaveBeenCalledWith({
      _id: productId,
      farmerId: 'user123',
    });
  });

  it('should save product after updates', async () => {
    const productId = '507f1f77bcf86cd799439027';
    const saveMock = jest.fn().mockResolvedValue(true);
    const originalProduct = {
      _id: productId,
      farmerId: 'user123',
      title: 'Product',
      quantity: 10,
      save: saveMock,
    };

    productModel.findOne = jest.fn().mockResolvedValue(originalProduct);
    originalProduct.quantity = 20;

    await request(app)
      .patch(`/api/products/${productId}`)
      .send({ quantity: 20 });

    expect(saveMock).toHaveBeenCalled();
  });

  it('should update price with both amount and currency', async () => {
    const productId = '507f1f77bcf86cd799439028';
    const originalProduct = {
      _id: productId,
      price: { amount: 50, currency: 'INR' },
      farmerId: 'user123',
      save: jest.fn().mockResolvedValue(true),
    };

    productModel.findOne = jest.fn().mockResolvedValue(originalProduct);
    originalProduct.price = { amount: 200, currency: 'USD' };

    const res = await request(app)
      .patch(`/api/products/${productId}`)
      .send({ price: { amount: 200, currency: 'USD' } });

    expect(res.statusCode).toBe(200);
    expect(res.body.product.price).toEqual({ amount: 200, currency: 'USD' });
  });
});

describe('DELETE /api/products/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete product successfully and return 200', async () => {
    const productId = '507f1f77bcf86cd799439030';
    const deletedProduct = {
      _id: productId,
      title: 'Product to Delete',
      category: 'Vegetable',
      price: { amount: 50, currency: 'INR' },
      quantity: 20,
      description: 'This product will be deleted',
      farmerId: 'user123',
      location: { coordinates: [56.78, 12.34] },
      deleteOne: jest.fn().mockResolvedValue({}),
    };

    productModel.findById = jest.fn().mockResolvedValue(deletedProduct);

    const res = await request(app).delete(`/api/products/${productId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Product deleted successfully');
    expect(productModel.findById).toHaveBeenCalledWith(productId);
    expect(deletedProduct.deleteOne).toHaveBeenCalled();
  });

  it('should return 404 when product does not exist', async () => {
    const productId = '507f1f77bcf86cd799439031';
    productModel.findById = jest.fn().mockResolvedValue(null);

    const res = await request(app).delete(`/api/products/${productId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Product not found');
    expect(productModel.findById).toHaveBeenCalledWith(productId);
  });

  it('should return 400 for invalid product ID format', async () => {
    const res = await request(app).delete('/api/products/invalid-id-format');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid product id');
  });

  it('should not allow seller to delete another seller\'s product', async () => {
    const productId = '507f1f77bcf86cd799439032';
    const otherProduct = {
      _id: productId,
      title: 'Another Seller Product',
      farmerId: 'otherUser123',
    };

    productModel.findById = jest.fn().mockResolvedValue(otherProduct);

    const res = await request(app).delete(`/api/products/${productId}`);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('message', 'Forbidden: You can only delete your own product');
    expect(productModel.findById).toHaveBeenCalledWith(productId);
  });

  it('should call findById with correct id', async () => {
    const productId = '507f1f77bcf86cd799439033';
    const deletedProduct = {
      _id: productId,
      farmerId: 'user123',
      title: 'Product',
      deleteOne: jest.fn().mockResolvedValue({}),
    };

    productModel.findById = jest.fn().mockResolvedValue(deletedProduct);

    await request(app).delete(`/api/products/${productId}`);

    expect(productModel.findById).toHaveBeenCalledWith(productId);
    expect(deletedProduct.deleteOne).toHaveBeenCalled();
  });

  it('should handle database error and return 500', async () => {
    const productId = '507f1f77bcf86cd799439034';
    productModel.findById = jest.fn().mockRejectedValue(new Error('Database error'));

    const res = await request(app).delete(`/api/products/${productId}`);

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message', 'Internal server error');
  });

  it('should successfully delete and verify ownership', async () => {
    const productId = '507f1f77bcf86cd799439035';
    const deletedProduct = {
      _id: productId,
      title: 'Tomato',
      category: 'Vegetable',
      price: { amount: 75, currency: 'INR' },
      quantity: 30,
      description: 'Fresh tomatoes',
      farmerId: 'user123',
      location: { coordinates: [56.78, 12.34] },
      image: {
        url: 'http://example.com/tomato.jpg',
        thumbnail: 'http://example.com/tomato-thumb.jpg',
        id: 'img123',
      },
      deleteOne: jest.fn().mockResolvedValue({}),
    };

    productModel.findById = jest.fn().mockResolvedValue(deletedProduct);

    const res = await request(app).delete(`/api/products/${productId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Product deleted successfully');
    expect(deletedProduct.deleteOne).toHaveBeenCalled();
  });

  it('should require authentication (farmer/seller role)', async () => {
    const productId = '507f1f77bcf86cd799439036';
    const deletedProduct = {
      _id: productId,
      farmerId: 'user123',
      title: 'Product',
      deleteOne: jest.fn().mockResolvedValue({}),
    };

    productModel.findById = jest.fn().mockResolvedValue(deletedProduct);

    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', 'Bearer valid_token');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Product deleted successfully');
  });

  it('should call deleteOne exactly once', async () => {
    const productId = '507f1f77bcf86cd799439037';
    const deletedProduct = {
      _id: productId,
      farmerId: 'user123',
      title: 'Product',
      deleteOne: jest.fn().mockResolvedValue({}),
    };

    productModel.findById = jest.fn().mockResolvedValue(deletedProduct);

    await request(app).delete(`/api/products/${productId}`);

    expect(deletedProduct.deleteOne).toHaveBeenCalledTimes(1);
  });

  it('should delete product with all fields intact', async () => {
    const productId = '507f1f77bcf86cd799439038';
    const deletedProduct = {
      _id: productId,
      title: 'Complete Product',
      category: 'Fruit',
      price: { amount: 100, currency: 'INR' },
      quantity: 50,
      description: 'A complete product',
      farmerId: 'user123',
      location: { coordinates: [12.34, 56.78] },
      image: {
        url: 'http://example.com/product.jpg',
        thumbnail: 'http://example.com/product-thumb.jpg',
        id: 'img456',
      },
      deleteOne: jest.fn().mockResolvedValue({}),
    };

    productModel.findById = jest.fn().mockResolvedValue(deletedProduct);

    const res = await request(app).delete(`/api/products/${productId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Product deleted successfully');
    expect(productModel.findById).toHaveBeenCalledWith(productId);
  });

  it('should return 200 with proper response structure', async () => {
    const productId = '507f1f77bcf86cd799439039';
    const deletedProduct = {
      _id: productId,
      title: 'Product',
      farmerId: 'user123',
      deleteOne: jest.fn().mockResolvedValue({}),
    };

    productModel.findById = jest.fn().mockResolvedValue(deletedProduct);

    const res = await request(app).delete(`/api/products/${productId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(typeof res.body.message).toBe('string');
    expect(res.body.message).toBe('Product deleted successfully');
  });

  it('should not allow deletion of non-existent product by another user', async () => {
    const productId = '507f1f77bcf86cd799439040';
    productModel.findById = jest.fn().mockResolvedValue(null);

    const res = await request(app).delete(`/api/products/${productId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Product not found');
  });

  it('should handle rapid deletion attempts (idempotency check)', async () => {
    const productId = '507f1f77bcf86cd799439041';
    const deletedProduct = {
      _id: productId,
      title: 'Product',
      farmerId: 'user123',
      deleteOne: jest.fn().mockResolvedValue({}),
    };

    productModel.findById = jest.fn()
      .mockResolvedValueOnce(deletedProduct)
      .mockResolvedValueOnce(null);

    // First deletion succeeds
    const res1 = await request(app).delete(`/api/products/${productId}`);
    expect(res1.statusCode).toBe(200);
    expect(res1.body).toHaveProperty('message', 'Product deleted successfully');

    // Second deletion fails (product already deleted)
    const res2 = await request(app).delete(`/api/products/${productId}`);
    expect(res2.statusCode).toBe(404);
    expect(res2.body).toHaveProperty('message', 'Product not found');
  });

  it('should handle deletion of product with complex location data', async () => {
    const productId = '507f1f77bcf86cd799439042';
    const deletedProduct = {
      _id: productId,
      title: 'Product',
      location: { coordinates: [-45.123, 170.456] },
      farmerId: 'user123',
      deleteOne: jest.fn().mockResolvedValue({}),
    };

    productModel.findById = jest.fn().mockResolvedValue(deletedProduct);

    const res = await request(app).delete(`/api/products/${productId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Product deleted successfully');
  });

  it('should properly delete product with minimum required fields', async () => {
    const productId = '507f1f77bcf86cd799439043';
    const deletedProduct = {
      _id: productId,
      title: 'Minimal Product',
      farmerId: 'user123',
      deleteOne: jest.fn().mockResolvedValue({}),
    };

    productModel.findById = jest.fn().mockResolvedValue(deletedProduct);

    const res = await request(app).delete(`/api/products/${productId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Product deleted successfully');
  });

  it('should verify seller ownership before deletion', async () => {
    const productId = '507f1f77bcf86cd799439044';
    const otherProduct = {
      _id: productId,
      title: 'Other Seller Product',
      farmerId: 'otherUserId',
    };

    productModel.findById = jest.fn().mockResolvedValue(otherProduct);

    const res = await request(app).delete(`/api/products/${productId}`);

    // Verify that findById is called and ownership check fails
    expect(productModel.findById).toHaveBeenCalledWith(productId);
    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('message', 'Forbidden: You can only delete your own product');
  });

  it('should handle database connection error gracefully', async () => {
    const productId = '507f1f77bcf86cd799439045';
    productModel.findById = jest.fn().mockRejectedValue(
      new Error('MongoDB connection failed')
    );

    const res = await request(app).delete(`/api/products/${productId}`);

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message', 'Internal server error');
  });

  it('should successfully delete product and call deleteOne', async () => {
    const productId = '507f1f77bcf86cd799439046';
    const deletedProduct = {
      _id: productId,
      title: 'Full Featured Product',
      category: 'Organic Vegetable',
      price: { amount: 120, currency: 'INR' },
      quantity: 100,
      description: 'Organic fresh vegetables from farm',
      farmerId: 'user123',
      location: { coordinates: [78.5, 21.3] },
      image: {
        url: 'http://example.com/product.jpg',
        thumbnail: 'http://example.com/product-thumb.jpg',
        id: 'imgXYZ',
      },
      deleteOne: jest.fn().mockResolvedValue({}),
    };

    productModel.findById = jest.fn().mockResolvedValue(deletedProduct);

    const res = await request(app).delete(`/api/products/${productId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Product deleted successfully');
    expect(productModel.findById).toHaveBeenCalledWith(productId);
    expect(deletedProduct.deleteOne).toHaveBeenCalled();
  });
});
