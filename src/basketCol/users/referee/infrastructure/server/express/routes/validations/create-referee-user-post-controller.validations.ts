import { RefereeUserPassword } from '@basketcol/domain';
import { body, ValidationChain } from 'express-validator';

export const createRefereeUserPOSTControllerValidations: ValidationChain[] = [
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

  body('email.value')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must provide a valid email address')
    .normalizeEmail({ all_lowercase: true, gmail_remove_dots: false }),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(RefereeUserPassword.passwordRegExp)
    .withMessage(RefereeUserPassword.getRequirementsAsString()),
];
