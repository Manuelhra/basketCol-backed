import { body, ValidationChain } from 'express-validator';

export const createLeagueSeasonPOSTControllerValidations: ValidationChain[] = [
  body('id')
    .notEmpty()
    .withMessage('Id is required')
    .isString()
    .withMessage('Id must be a string'),

  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string'),

  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isString()
    .withMessage('Start date must be a string'),

  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isString()
    .withMessage('End date must be a string'),

  body('courtIdList')
    .notEmpty()
    .withMessage('Court id list is required')
    .isArray({ min: 1 })
    .withMessage('Court id list must be a non-empty array')
    .custom((array: any[]) => array.every(String))
    .withMessage('Court id list must be an array of strings'),

  body('leagueId')
    .notEmpty()
    .withMessage('League id is required')
    .isString()
    .withMessage('League id must be a string'),
];
