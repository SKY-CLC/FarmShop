const express = require('express');
const validators = require('../middlewares/validator.middleware');
const userModel = require('../db/models/user.model');
const authContoller = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');


const router = express.Router();

router.post('/register', validators.registerUserValidations, authContoller.registerUser );
router.post('/login', validators.loginUserValidations, authContoller.loginUser);
router.get('/me',authMiddleware,authContoller.getCurrentUser);
router.get('/logout',authContoller.logoutUser);

module.exports = router;
