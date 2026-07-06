const orderModel = require('../db/models/order.model')
const { publishToQueue } = require('../broker/broker')
const axios = require('axios')
const mongoose = require('mongoose');


async function createOrder(req,res)
{
    const user = req.user;
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[ 1 ];


    

    try {

      
       const cartResponse = await axios.get('http://localhost:3002/api/cart', 
        {
           headers: {
            Authorization: `Bearer ${token}`
           }
        }
    )


       

       const products = await Promise.all(cartResponse.data.cart.items.map(async (item)=> {
                      
            return (await axios.get(`http://localhost:3001/api/products/${item.productId}`,{
                 headers: {
                    Authorization: `Bearer ${token}`
                 }
            })).data.product

       }))

      

       let priceAmount = 0;

       const orderItems = cartResponse.data.cart.items.map((item, index) => {

             const product = products.find(p => p._id.toString() === item.productId.toString())

             if(product.quantity < item.quantity)
             {
                throw new Error(`Product ${product.title} is out of stock or insufficient`)
             }

             const itemTotal = product.price.amount * item.quantity;
             priceAmount += itemTotal;

             

             return {
                productId: item.productId,
                quantity: item.quantity,
                thumbnail: product.image.url,
                title: product.title,
                price: {
                    amount: itemTotal,
                    currency: product.price.currency
                }
             }
       })



       const order = await orderModel.create({
           shopkeeperId: user.id,
           products: orderItems,
           status: "pending",
           totalPrice: {
             amount: priceAmount,
             currency: "INR"
           }
       })

      await publishToQueue('ORDER_SELLER_DASHBOARD.ORDER_CREATED',order);

       res.status(201).json({
           message: "Order created successfully",
           order
       })
 
        
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }

}

async function getMyOrders(req,res)
{
    const user = req.user;

    

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
       
        const orders = await orderModel.find({
            shopkeeperId: user.id
        }).skip(skip).limit(limit).sort({ createdAt: -1 });


        

        const orderStats = await orderModel.aggregate([
      {
       $match: {
       shopkeeperId: new mongoose.Types.ObjectId(user.id)
          }
      },
      {
         $group: {
          _id: "$status",
          count: { $sum: 1 }
          }
       }
      ]);

         const stats = {
          pending: 0,
          accepted: 0,
          rejected: 0,
          cancelled: 0
         };


         orderStats.forEach(item => {
         stats[item._id] = item.count;
        });
         
       

        res.status(200).json({
            orders,
            stats: stats
        })
    }
    catch(err)
    {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }
}

async function getOrderById(req,res)
{
    const user = req.user
    const orderId = req.params.id;

    try {

        const order = await orderModel.findById(orderId);

        if(!order)
        {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if(order.shopkeeperId.toString() !== user.id)
        {
            return res.status(403).json({
                message: "Forbidden: You do not have access"
            })
        }
        
        res.status(200).json({
            order
        });

        
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }
    
}

async function cancelOrderById(req,res) {
    
    const user = req.user;
    const orderId = req.params.id;
    
    try {
 
        const order = await orderModel.findById(orderId);

        if(!order)
        {
            return res.status(404).json({
                message: "Order not found"
            })
        }
        
        if(order.shopkeeperId.toString() !== user.id)
        {
            return res.status(403).json({
                message: "Forbidden: You do not have access"
            })
        }

        if(order.status !== 'pending')
        {
            return res.status(409).json({
                message: "Order cannot be cancelled at this moment"
            })
        }

        order.status = "cancelled";

        await order.save();

        await publishToQueue("ORDER_CANCELLED", {
            orderId: order._id,
            status: "cancelled"
        });


        res.status(200).json({
            order
        });
        
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }

}





module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrderById
}