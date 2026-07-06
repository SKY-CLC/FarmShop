const request = require('supertest');
const app = require('../app');
const { connectMemoryDB, clearDB, disconnectMemoryDB } = require('../db/test-db');

describe('POST /api/auth/register', () => {
  beforeAll(async () => {
    await connectMemoryDB();
    process.env.JWT_SECRET = "test_jwt_secret_key";
  });

  afterEach(async () => {
    await clearDB();
  });

  afterAll(async () => {
    await disconnectMemoryDB();
  });

  it('creates a new user and returns expected fields', async () => {
    const payload = {
      username: 'farmer1',
      name: 'Farmer One',
      email: 'farmer1@example.com',
      password: 'password123',
      role: 'farmer',
      location: { type: 'Point', coordinates: [12.34, 56.78] },
    };

    const response = await request(app).post('/api/auth/register').send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
    expect(response.body.user).toMatchObject({
      username: 'farmer1',
      email: 'farmer1@example.com',
      role: 'farmer',
    });
    expect(response.body.user.id).toBeTruthy();
  });

  it('returns 409 when email or username duplicates an existing user', async () => {
    const payload = {
      username: 'farmer1',
      name: 'Farmer One',
      email: 'farmer1@example.com',
      password: 'password123',
      role: 'farmer',
      location: { type: 'Point', coordinates: [12.34, 56.78] },
    };

    await request(app).post('/api/auth/register').send(payload);
    const duplicateEmail = { ...payload, username: 'farmer2' };
    const duplicateUsername = { ...payload, email: 'farmer2@example.com' };

    const emailResponse = await request(app).post('/api/auth/register').send(duplicateEmail);
    const usernameResponse = await request(app).post('/api/auth/register').send(duplicateUsername);

    expect(emailResponse.status).toBe(409);
    expect(usernameResponse.status).toBe(409);
  });

  it('returns 400 when required fields are missing', async () => {
    const payload = {
      username: 'farmer3',
      name: 'Farmer Three',
      email: '',
      password: 'password123',
      role: 'farmer',
    };

    const response = await request(app).post('/api/auth/register').send(payload);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });
});
