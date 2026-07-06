const mongoose = require('mongoose');

const orderSchema =  new mongoose.Schema({
     
      shopkeeperId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },

      
      totalPrice: {
         
         amount: {
                  type: Number,
                  required: true
                },

          currency: {
                  type: String,
                  required: true,
                  enum: ['INR', 'USD'],
                }
          },


      products: 
        [
           {
               productId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
               },

               quantity:  {
                 type: Number,
                 default: 1,
                 min: 1
               },

               thumbnail : {
                   type : String
               },

               title : {
                 type : String
               },

               price: {
                  
                amount: {
                  type: Number,
                  required: true
                },

                currency: {
                  type: String,
                  required: true,
                  enum: ['INR', 'USD'],
                }

               }
           }
        ],

      
      status: {
        type: String,
        enum: [ 'pending', 'accepted', 'rejected', 'cancelled' ],
      }

}, { timestamps: true });


const orderModel = mongoose.model('order',orderSchema);

module.exports = orderModel;