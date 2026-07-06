const request = require('supertest');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./src/app');
const userModel = require('./src/db/models/user.model');

(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  const hashedPassword = await bcrypt.hash('password123', 10);
  await userModel.create({
    username: 'loginuser',
    name: 'Login User',
    email: 'loginuser@example.com',
    password: hashedPassword,
    role: 'farmer',
    location: { type: 'Point', coordinates: [12, 34] },
  });

  const response = await request(app)
    .post('/api/auth/login')
    .send({ email: 'loginuser@example.com', password: 'password123' });

  console.log('status', response.status);
  console.log('body', response.body);
  console.log('headers', response.headers);

  await mongoose.disconnect();
  await mongoServer.stop();
})();
