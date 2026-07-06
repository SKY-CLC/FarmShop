const express = require('express');
const createAuthMiddleware = require('../middlewares/auth.middleware');
const validator= require('../middlewares/validation.middleware');
const multer = require('multer');
const productController = require('../controllers/product.controller');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();



router.post(
  '/',
  createAuthMiddleware(['farmer']),
  upload.single('image'),
  validator.productValidationRules,
  productController.createProduct
);

router.get('/', productController.getProducts);
router.patch('/:id', createAuthMiddleware(['farmer']),productController.updateProduct);
router.delete('/:id',createAuthMiddleware(['farmer']),productController.deleteProduct);
router.get('/farmer',createAuthMiddleware(['farmer']),productController.getProductsByFarmer);
router.get('/:id', productController.getProductById);
router.patch('/quantity/:id',productController.updateProductQuantity);

module.exports = router;