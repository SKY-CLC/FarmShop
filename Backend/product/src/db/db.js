const mongoose = require('mongoose');

async function connectDB() {
    try{
          await mongoose.connect(process.env.MONGO_URI);
          console.log("Connected to with database");
    }
    catch(err){
        console.error("Error connecting to database: ", err);
    }
}

module.exports = connectDB;