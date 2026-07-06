const cartModel = require('../db/models/cart.model');



async function addItemToCart(req, res)
{
    const { productId } =  req.body;


    const user = req.user;

    try {

    let cart = await cartModel.findOne({
        user: user.id
    });

    if(!cart)
    {
        cart = new cartModel({
            user: user.id,
            items: []
        });
    }


    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if(existingItemIndex >= 0)
    {
        cart.items[existingItemIndex].quantity += 1;
    }
    else{
        cart.items.push({ productId, quantity: 1 });
    }

    await cart.save();

    res.status(201).json({
        message: "Item added to cart",
        cart
    })
    
     } catch (error) {
        res.status(500).json({
            message: "Error while adding item to cart",
            error: error.message
        });
    }

    
}





async function updateItemQuantity(req, res)
{
    const { productId } = req.params;
    const { quantity } = req.body;

    const user = req.user;


    

    try {
        const cart = await cartModel.findOne({
            user: user.id
        });

        if(!cart)
        {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const item = cart.items.find(item => item.productId.toString() === productId);

        if(!item)
        {
            return res.status(404).json({
                message: "Item not found in cart"
            });
        }

        item.quantity = Number(quantity);
        await cart.save();

        res.status(200).json({
            message: "Item quantity updated",
            cart
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating item",
            error: error.message
        });
    }
}

async function getCart(req, res)
{
    const user = req.user;


    try {

    let cart = await cartModel.findOne({
        user: user.id
    })

   

    if(!cart)
    {
        cart = new cartModel({
            user: user.id,
            items: []
        })
        await cart.save();
    }


    res.status(200).json({
        cart,
        totals: {
            itemCount: cart.items.length,
            totalQuantity: cart.items.reduce((sum, item) => sum + item.quantity,0)
        }
    })

    

    } catch (error) {
         
        res.status(500).json({
            message: "Error fetching item",
            error: error.message
        });
    }
}


async function deleteCartItem(req,res)
{
    const { productId } = req.params;
    
    try {

       const cart = await cartModel.findOne({
            user: req.user.id
        });

        if(!cart)
        {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const newItems = cart.items.filter(item => item.productId.toString() !== productId);

        cart.items = newItems;

        await cart.save();

        res.status(200).json({
            message: "Item deleted successfully",
            cart
        })
        
    } catch (error) {
         res.status(500).json({
            message: "Error deleting item",
            error: error.message
        });
    }


}

module.exports = {
    addItemToCart,
    updateItemQuantity,
    getCart,
    deleteCartItem
}