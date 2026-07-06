const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
         
    username: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    email: {
         type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        select: false,
    },

    role : {
        type : String,
        enum : [ "farmer", "shopkeeper" ],
        required: true
    },

    location : {
        type : {
           type:  String,
           default : "Point"
        },
       
        coordinates : {
            type: [Number],
            required: true
        }
    }

}, { timestamps: true } )

userSchema.index({ location: '2dsphere' });

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;