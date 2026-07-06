const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');


function validateCart(req, res, next)
{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        console.log(errors);
        return res.status(400).json({
            errors: errors.array()
        });
    }
    next();
}


const validateAddItemToCart = [

     body('productId')
     .isString()
     .withMessage("Product ID must be string")
     .custom(value => mongoose.Types.ObjectId.isValid(value))
     .withMessage("Invalid Product ID format"),
     
     validateCart
    
]

const validateUpdateItemQuantity = [

     body('quantity')
     .isInt({ gt: 0 })
     .withMessage("Quantity must be a positive integer"),
     
     validateCart
    
]

module.exports = {
    validateAddItemToCart,
    validateUpdateItemQuantity
}