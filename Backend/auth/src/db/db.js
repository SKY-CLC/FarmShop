const mongoose = require('mongoose');


async function connectDB()
{
     try {
        
         await mongoose.connect(process.env.MONGO_URI);
         console.log("Connected with database");

     } catch (err) {
        console.error(err);
     }
}

module.exports = connectDB;