const express = require('express');
const cartController = require('../controllers/cart.controller');
const validation = require('../middlewares/validation.middlewares')
const createAuthMiddleware = require('../middlewares/auth.middleware')




const router = express.Router();


router.post('/items',
    createAuthMiddleware(['shopkeeper']),
    validation.validateAddItemToCart,
    cartController.addItemToCart);

router.patch('/items/:productId',
    createAuthMiddleware(['shopkeeper']),
    validation.validateUpdateItemQuantity,
    cartController.updateItemQuantity);

router.get('/',
    createAuthMiddleware(['shopkeeper']),
    cartController.getCart
)

router.delete('/:productId',
    createAuthMiddleware(['shopkeeper']),
    cartController.deleteCartItem
)



module.exports = router;