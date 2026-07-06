const express = require('express');
const cookieParser = require('cookie-parser');
const router = require('./routes/order.routes')
const cors = require('cors')

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173" ,
    credentials: true
}))

app.use('/api/orders',router);


module.exports = app;