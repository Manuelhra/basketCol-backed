import {
  PlayerUserType,
  HostUserType,
  LeagueFounderUserType,
  RefereeUserType,
  TeamFounderUserType,
} from '@basketcol/domain';
import { body, ValidationChain } from 'express-validator';

const validUserTypes:string[] = [
  PlayerUserType.value,
  HostUserType.value,
  LeagueFounderUserType.value,
  RefereeUserType.value,
  TeamFounderUserType.value,
];

export const requestPasswordResetPOSTControllerValidations: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Must provide a valid email address')
    .normalizeEmail({ all_lowercase: true, gmail_remove_dots: false }),
  body('userType')
    .notEmpty()
    .withMessage('User type is required')
    .isString()
    .isIn(validUserTypes)
    .withMessage(`User type must be one of: ${validUserTypes.join(', ')}`),
];
