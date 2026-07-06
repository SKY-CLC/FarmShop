require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db')
const { connect } = require('./src/broker/broker')
const listeners = require('./src/broker/listeners')

connectDB();
connect().then(() => {
    listeners()
});

app.listen(3003,()=>{
    console.log("Server is running on port 3003");
})