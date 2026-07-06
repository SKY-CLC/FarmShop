const { subscribeToQueue } = require('./broker');
const userModel = require('../db/models/user.model');
const productModel = require('../db/models/product.model');
const orderModel = require('../db/models/order.model');


module.exports = function () {
      
    subscribeToQueue('AUTH_SELLER_DASHBOARD.USER_CREATED', async(user) => {
        await userModel.create(user);
    });

    subscribeToQueue('PRODUCT_SELLER_DASHBOARD.PRODUCT_CREATED', async(product)=>{
         await productModel.create(product);
    });

    subscribeToQueue('ORDER_SELLER_DASHBOARD.ORDER_CREATED', async(order)=>{
        await orderModel.create(order);
    });

    subscribeToQueue('ORDER_CANCELLED', async(odr) => {
            await orderModel.findByIdAndUpdate(
            odr.orderId,
            { status: odr.status }
          );
       });


    subscribeToQueue('UPDATE_PRODUCT', async(product) => {
            await productModel.findByIdAndUpdate(
            product._id,
            product,
          );
       });


}

