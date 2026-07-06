const express = require('express');
const validator = require('../middlewares/validation.middleware')
const router = express.Router();
const orderController = require('../controllers/order.controller')
const createAuthMiddleware = require('../middlewares/auth.middleware')


router.post('/',createAuthMiddleware(['shopkeeper']),orderController.createOrder);
router.get('/me',createAuthMiddleware(['shopkeeper']),orderController.getMyOrders);
router.post('/:id/cancel',createAuthMiddleware(['shopkeeper']),orderController.cancelOrderById);
router.get('/:id',createAuthMiddleware(['shopkeeper']),orderController.getOrderById);


module.exports = router;