const { subscribeToQueue }  = require('./broker');
const orderModel = require('../db/models/order.model');

module.exports = function () {
      
    subscribeToQueue('ORDER_ACCEPTED', async(odr) => {
        await orderModel.findByIdAndUpdate(
        odr.orderId,
        { status: odr.status },
        { new: true }
      );
    });

    subscribeToQueue('ORDER_REJECTED', async(odr) => {
        await orderModel.findByIdAndUpdate(
        odr.orderId,
        { status: odr.status },
        { new: true }
      );
    });

}