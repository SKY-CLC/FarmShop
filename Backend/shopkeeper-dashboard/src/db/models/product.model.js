const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    
      title: {
        type: String,
        required: true,
      },

      category: {
        type: String,
        required: true,
      },

      price : {
        amount :  {
            type: Number, 
            required: true,
            min : 0
        },
        currency: {
            type: String,
            enum: [ 'USD', 'INR' ],
            default: 'INR'
        }
      },

      quantity : {
        type: Number,
        required: true,
        min : 0.1
      },

      description : {
        type: String,
      }, 
      
      image : {
        url: String,
        thumbnail: String,
        id: String
      },

      harvestDate : {
        type: Date,
        required: true,
      },

      expiryDate : {
        type: Date,
        required: true,
      },
    
      farmerId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },

      location : {
        type : {
           type:  String,
           enum : ['Point'],
           default : "Point"
        },
       
        coordinates : {
            type: [Number],
            required: true
        }
    }
      
},{ timestamps: true });

productSchema.index(
    { expiryDate: 1 },
    { expireAfterSeconds: 0 }
);

productSchema.index({ location: '2dsphere' });

productSchema.index({ title: 'text', description: 'text' });


const productModel = mongoose.model('product', productSchema);

module.exports = productModel;