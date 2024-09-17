import { body, ValidationChain } from 'express-validator';

export const createHostUserPOSTControllerValidations: ValidationChain[] = [
  body('id')
    .notEmpty()
    .withMessage('Id is required')
    .isString()
    .withMessage('Id must be a string'),

  body('name.firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isString()
    .withMessage('First name must be a string'),

  body('name.lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isString()
    .withMessage('Last name must be a string'),

  body('biography')
    .notEmpty()
    .withMessage('Biography is required')
    .isString()
    .withMessage('Biography must be a string'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must provide a valid email address'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
];
