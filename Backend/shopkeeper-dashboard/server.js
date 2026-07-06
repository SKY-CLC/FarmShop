require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db')
const listeners = require('./src/broker/listeners')
const { connect } = require('./src/broker/broker');

connectDB();

connect().then(()=>{
    listeners();
})

app.listen(3005,()=>{
    console.log("Server is running on port 3005");
})