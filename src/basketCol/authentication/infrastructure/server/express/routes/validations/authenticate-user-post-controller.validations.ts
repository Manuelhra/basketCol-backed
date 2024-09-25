import {
  HostUserType,
  LeagueFounderUserType,
  PlayerUserType,
  RefereeUserType,
  TeamFounderUserType,
  UserPassword,
} from '@basketcol/domain';
import { ValidationChain, body } from 'express-validator';

const validUserTypes:string[] = [
  PlayerUserType.value,
  HostUserType.value,
  LeagueFounderUserType.value,
  RefereeUserType.value,
  TeamFounderUserType.value,
];

export const authenticateUserPOSTControllerValidations: ValidationChain[] = [
  body('nickname')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Nickname must be a non-empty string'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Must provide a valid email address')
    .normalizeEmail({ all_lowercase: true, gmail_remove_dots: false }),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(UserPassword.passwordRegExp)
    .withMessage(UserPassword.getRequirementsAsString()),

  body('userType')
    .notEmpty()
    .withMessage('User type is required')
    .isString()
    .isIn(validUserTypes)
    .withMessage(`User type must be one of: ${validUserTypes.join(', ')}`),
];
