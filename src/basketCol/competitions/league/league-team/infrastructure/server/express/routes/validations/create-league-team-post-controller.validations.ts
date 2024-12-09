import { body, ValidationChain } from 'express-validator';

export const createLeagueTeamPOSTControllerValidations: ValidationChain[] = [
  body('id')
    .notEmpty()
    .withMessage('Id is required')
    .isString()
    .withMessage('Id must be a string'),

  body('teamId')
    .notEmpty()
    .withMessage('Team id is required')
    .isString()
    .withMessage('Team id must be a string'),

  body('leagueId')
    .notEmpty()
    .withMessage('League id is required')
    .isString()
    .withMessage('League id must be a string'),
];
