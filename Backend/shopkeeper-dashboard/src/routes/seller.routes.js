const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/seller.controller');
const createAuthMiddleware = require('../middlewares/auth.middleware')



router.get('/metrics',createAuthMiddleware(["farmer"]),sellerController.getMetrics);
router.get('/orders',createAuthMiddleware(["farmer"]),sellerController.getOrders);
router.patch('/accept/:id',createAuthMiddleware(["farmer"]),sellerController.acceptOrder);
router.patch('/reject/:id',createAuthMiddleware(["farmer"]),sellerController.rejectOrder);


module.exports = router;
