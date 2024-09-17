import {
  HostUserType,
  LeagueFounderUserType,
  PlayerUserType,
  RefereeUserType,
  TeamFounderUserType,
} from '@basketcol/domain';
import { ValidationChain, body } from 'express-validator';

const validUserTypes:string[] = [
  PlayerUserType.getType(),
  HostUserType.getType(),
  LeagueFounderUserType.getType(),
  RefereeUserType.getType(),
  TeamFounderUserType.getType(),
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

  body('userType')
    .notEmpty()
    .withMessage('User type is required')
    .isString()
    .isIn(validUserTypes)
    .withMessage(`User type must be one of: ${validUserTypes.join(', ')}`),
];
