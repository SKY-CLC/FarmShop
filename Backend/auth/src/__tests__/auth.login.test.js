const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../app');
const userModel = require('../db/models/user.model');
const { connectMemoryDB, clearDB, disconnectMemoryDB } = require('../db/test-db');

describe('POST /api/auth/login', () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = 'testsecret';
    await connectMemoryDB();
  });

  afterEach(async () => {
    await clearDB();
  });

  afterAll(async () => {
    await disconnectMemoryDB();
  });

  it('returns 200 and sets a token cookie for valid credentials', async () => {
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({
      username: 'loginuser',
      name: 'Login User',
      email: 'loginuser@example.com',
      password: hashedPassword,
      role: 'farmer',
      location: {
        type: 'Point',
        coordinates: [12, 34],
      },
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'loginuser@example.com', password });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Login successful');
    expect(response.body.user).toMatchObject({
      username: 'loginuser',
      email: 'loginuser@example.com',
      role: 'farmer',
    });
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('returns 401 for invalid credentials', async () => {
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({
      username: 'loginuser2',
      name: 'Login User 2',
      email: 'loginuser2@example.com',
      password: hashedPassword,
      role: 'shopkeeper',
      location: {
        type: 'Point',
        coordinates: [56, 78],
      },
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'loginuser2@example.com', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid email or password');
  });

  it('returns 400 when required validation fails', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'not-an-email', password: 'short' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Validation errors');
  });
});
