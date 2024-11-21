import { TeamGender } from '@basketcol/domain';
import { body, ValidationChain } from 'express-validator';

export const createTeamPOSTControllerValidations: ValidationChain[] = [
  body('id')
    .notEmpty()
    .withMessage('Id is required')
    .isString()
    .withMessage('Id must be a string'),

  body('officialName')
    .notEmpty()
    .withMessage('Official name is required')
    .isString()
    .withMessage('Official name must be a string'),

  body('gender')
    .notEmpty()
    .withMessage('Gender is required')
    .isString()
    .isIn(TeamGender.validGenders)
    .withMessage(`Gender must be one of: ${TeamGender.validGenders.join(', ')}`),

  body('teamFounderUserId')
    .notEmpty()
    .withMessage('Team founder user id is required')
    .isString()
    .withMessage('Team founder user id must be a string'),
];
