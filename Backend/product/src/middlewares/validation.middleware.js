const { body, validationResult } = require('express-validator');

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}

const productValidationRules = [
  body('title')
    .notEmpty()
    .withMessage('Title is required'),

  body('category')
    .notEmpty()
    .withMessage('Category is required'),

  body('priceAmount')
    .notEmpty()
    .withMessage('priceAmount is required')
    .isFloat({ gt: 0 })
    .withMessage('priceAmount must be a positive number'),

  body('priceCurrency')
    .optional()
    .notEmpty()
    .withMessage('priceCurrency must be a non-empty string'),

  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ gt: 0 })
    .withMessage('Quantity must be a non-negative integer'),

  body('harvestDate')
    .notEmpty()
    .withMessage('Harvest date is required'),

  body('shelfLifeDays')
    .notEmpty()
    .withMessage('shelfLifeDays is required')
    .isInt({ min: 0 })
    .withMessage('Shelf life days must be a non-negative integer'),

  body('description')
    .optional()
    .notEmpty()
    .withMessage('Description must be a non-empty string'),

  body('location')
    .notEmpty()
    .withMessage('Location is required')
    .custom(value => {
      try {
        const parsedLocation = JSON.parse(value);
        if (!parsedLocation || typeof parsedLocation !== 'object') {
          throw new Error();
        }
        return true;
      } catch {
        throw new Error('Location must be valid JSON');
      }
    }),

    validateRequest
];

module.exports = 
{
    productValidationRules
}
