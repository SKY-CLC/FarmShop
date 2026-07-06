const  { body, validationResult } = require('express-validator');

const respondWithValidationErrors = (req, res, next) => {
   const error = validationResult(req);
   if (!error.isEmpty()) {
      
       console.log("Validation errors:", error.array());
      return res.status(400).json({ 
        message: "Validation errors",
        errors: error.array() 
    });
   }
   next();
};

const registerUserValidations = [ 
    body("username")
    .isString()
    .withMessage("Username must be a string")
    .isLength({ min: 3})
    .withMessage("Username must be at least 3 characters long"),

    body("email")
    .isEmail()
    .withMessage("Invalid email format"),
    

    body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

    body("name")
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Name cannot be empty"),

    body("role")
    .isIn([ "farmer", "shopkeeper" ])
    .withMessage("Role must be either 'farmer' or 'shopkeeper'")
    .notEmpty()
    .withMessage("Role cannot be empty"),

    body("location")
    .isObject()
    .withMessage("Location must be an object"),

    body("location.type")
    .equals("Point")
    .withMessage("Location type must be 'Point'"),

    body("location.coordinates")
    .isArray({ min: 2, max: 2 })
    .withMessage("Location coordinates must be an array of two numbers"),

    body("location.coordinates.*")
    .isFloat()
    .withMessage("Location coordinates must be numbers"),


    respondWithValidationErrors
    
 ]

 const loginUserValidations = [ 

     body("userId")
     .notEmpty()
     .withMessage("Email or Username required")
     .isString()
     .withMessage("Username must be a string"),

     body("password")
     .isLength({ min: 8 })
     .withMessage("Password must be at least 8 characters long"),

     
        respondWithValidationErrors
    

    
  ] 

 module.exports = {
    registerUserValidations,
    loginUserValidations
 
 }

