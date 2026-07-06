const express = require('express');
const cookieParser = require('cookie-parser');
const sellerRoutes = require('../src/routes/seller.routes')
const cors = require('cors')


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173" ,
    credentials: true
}))

app.use('/api/seller/dashboard', sellerRoutes);

module.exports = app;
