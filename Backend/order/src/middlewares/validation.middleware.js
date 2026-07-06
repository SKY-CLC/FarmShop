const { body, validationResult } = require('express-validator');

function validateRequest(req, res, next)
{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    next();
}

const orderValidationRules = [
   
    body('totalAmount')
    .notEmpty()
    .withMessage('Total Amount is required')
    .isFloat({ min: 0 })
    .withMessage('Price cannot be negative'),

    body('products.quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ gt: 0 })
    .withMessage('Product quantity cannot be zero'),

    validateRequest

];

module.exports = {
    orderValidationRules
}