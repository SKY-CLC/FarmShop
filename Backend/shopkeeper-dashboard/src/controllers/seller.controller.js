const userModel = require('../db/models/user.model');
const productModel = require('../db/models/product.model');
const orderModel = require('../db/models/order.model');
const axios = require('axios');
const { publishToQueue } = require('../broker/broker')

async function getMetrics(req,res)
{
    const farmerId = req.user.id;

    try{
        
   const data = await orderModel.aggregate([

    { $unwind: "$products" },

    {
      $lookup: {
        from: "products",
        localField: "products.productId",
        foreignField: "_id",
        as: "product"
      }
    },

    { $unwind: "$product" },

    {
      $match: {
        "product.farmerId": farmerId,
        status: "accepted"
      }
    },

    {
      $group: {
        _id: "$product._id",
        title: { $first: "$product.title" },
        sold: { $sum: "$products.quantity" },
        revenue: {
          $sum: {
            $multiply: [
              "$products.quantity",
              "$products.price.amount"
            ]
          }
        }
      }
    },

    { $sort: { sold: -1 } }
  ]);

  res.json({
    totalSales: data.reduce((sum, p) => sum + p.revenue, 0),
    topProduct: data[0] || null
  });

    }
    catch(err)
    {
       console.error("Error fetching metrics: ", err);

        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function getOrders(req,res)
{
    try{

    const farmerId = req.user.id
     
    const products = await productModel.find({
        farmerId
    }).select("_id")

   const productIds = products.map(p => p._id);

   const orders = await orderModel.find({
   "products.productId": { $in: productIds }
   });

   res.status(200).json({ orders });
}

catch(err)
{
    console.error("Error fetching metrics: ", err);

    res.status(500).json({
        message: "Internal Server Error"
    })
}

}


async function acceptOrder(req, res) {

    

    const { id } = req.params;

    try {

        const order = await orderModel.findById(id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (order.status !== "pending") {
            return res.status(400).json({
                message: "Order already processed"
            });
        }


     

        for (const item of order.products) {

          const product = await productModel.findById(item.productId);

        if (!product) {
         return res.status(404).json({
            message: "Product not found"
         });
      }

         if (product.quantity < item.quantity) {
         return res.status(400).json({
             message: "Item Out of stock"
         });
       }
      }

      
     
     
        
    for (const item of order.products) {
    
       try {
        
      
    await axios.patch(
        `http://localhost:3001/api/products/quantity/${item.productId}`,
        {
            quantity: item.quantity
        }
      );}
        catch (err) {
    console.error(err.response?.data || err.message);
  }
      }
    
    

     
       

        
        order.status = "accepted";
        await order.save();
       
        
        await publishToQueue("ORDER_ACCEPTED", {
            orderId: order._id,
            status: "accepted"
        });

        return res.status(200).json({
            message: "Order accepted successfully",
            order
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to accept order"
        });
    }
}


async function rejectOrder(req,res)
{
      const { id } = req.params;

    try {

        const order = await orderModel.findById(id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (order.status !== "pending") {
            return res.status(400).json({
                message: "Order already processed"
            });
        }

         order.status = "rejected";
        await order.save();

       
        await publishToQueue("ORDER_REJECTED", {
            orderId: order._id,
            status: "rejected"
        });

        return res.status(200).json({
            message: "Order rejected successfully",
            order
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to reject order"
        });
    }

}


module.exports = {
    getMetrics,
    getOrders,
    acceptOrder,
    rejectOrder
}