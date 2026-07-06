const mongoose = require('mongoose');


async function connectDB()
{
    try {
     
         await mongoose.connect(process.env.MONGO_URI);
         console.log("Connected with database");

    } catch (error) {
        console.error("Error while connecting with database: ", error)
    }
}



module.exports = connectDB;