import { body, ValidationChain } from 'express-validator';

export const createLeagueSeasonAwardsPOSTControllerValidations: ValidationChain[] = [
  body('id')
    .notEmpty()
    .withMessage('Id is required')
    .isString()
    .withMessage('Id must be a string'),

  body('bestThreePointShooterId')
    .notEmpty()
    .withMessage('Best three point shooter id is required')
    .isString()
    .withMessage('Best three point shooter id must be a string'),

  body('bestTwoPointShooterId')
    .notEmpty()
    .withMessage('Best two point shooter id is required')
    .isString()
    .withMessage('Best two point shooter id must be a string'),

  body('bestFreeThrowShooterId')
    .notEmpty()
    .withMessage('Best free throw shooter id is required')
    .isString()
    .withMessage('Best free throw shooter id must be a string'),

  body('bestAssistProviderId')
    .notEmpty()
    .withMessage('Best assist provider id is required')
    .isString()
    .withMessage('Best assist provider id must be a string'),

  body('bestOffensiveRebounderId')
    .notEmpty()
    .withMessage('Best offensive rebounder id is required')
    .isString()
    .withMessage('Best offensive rebounder id must be a string'),

  body('bestDefensiveRebounderId')
    .notEmpty()
    .withMessage('Best defensive rebounder id is required')
    .isString()
    .withMessage('Best defensive rebounder id must be a string'),

  body('mostValuablePlayerId')
    .notEmpty()
    .withMessage('Most valuable player id is required')
    .isString()
    .withMessage('Most valuable player id must be a string'),

  body('championTeamId')
    .notEmpty()
    .withMessage('Champion team id is required')
    .isString()
    .withMessage('Champion team id must be a string'),

  body('leagueSeasonId')
    .notEmpty()
    .withMessage('League season id is required')
    .isString()
    .withMessage('League season id must be a string'),
];
