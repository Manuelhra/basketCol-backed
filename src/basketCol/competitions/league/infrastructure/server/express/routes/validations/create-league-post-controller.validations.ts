import { body, ValidationChain } from 'express-validator';

export const createLeaguePOSTControllerValidations: ValidationChain[] = [
  body('id')
    .notEmpty()
    .withMessage('Id is required')
    .isString()
    .withMessage('Id must be a string'),

  body('name.short')
    .notEmpty()
    .withMessage('Short name is required')
    .isString()
    .withMessage('Short name must be a string'),

  body('name.official')
    .notEmpty()
    .withMessage('Official name is required')
    .isString()
    .withMessage('Official name must be a string'),

  body('description.short')
    .notEmpty()
    .withMessage('Short description is required')
    .isString()
    .withMessage('Short description must be a string'),

  body('description.complete')
    .notEmpty()
    .withMessage('Complete description is required')
    .isString()
    .withMessage('Complete description must be a string'),

  body('gender')
    .notEmpty()
    .withMessage('Gender is required')
    .isString()
    .withMessage('Gender must be a string'),

  body('rules')
    .notEmpty()
    .withMessage('Rules are required')
    .isString()
    .withMessage('Rules must be a string'),

  body('level')
    .notEmpty()
    .withMessage('Level is required')
    .isString()
    .withMessage('Level must be a string'),

  body('location.country.code')
    .notEmpty()
    .withMessage('Country code is required')
    .isString()
    .withMessage('Country code must be a string'),

  body('location.country.label')
    .notEmpty()
    .withMessage('Country label is required')
    .isString()
    .withMessage('Country label must be a string'),

  body('location.department.code')
    .notEmpty()
    .withMessage('Department code is required')
    .isString()
    .withMessage('Department code must be a string'),

  body('location.department.label')
    .notEmpty()
    .withMessage('Department label is required')
    .isString()
    .withMessage('Department label must be a string'),

  body('location.city.code')
    .notEmpty()
    .withMessage('City code is required')
    .isString()
    .withMessage('City code must be a string'),

  body('location.city.label')
    .notEmpty()
    .withMessage('City label is required')
    .isString()
    .withMessage('City label must be a string'),

  body('location.coords.lat')
    .notEmpty()
    .withMessage('Latitude is required')
    .isNumeric()
    .withMessage('Latitude must be a number'),

  body('location.coords.lng')
    .notEmpty()
    .withMessage('Longitude is required')
    .isNumeric()
    .withMessage('Longitude must be a number'),

  body('establishmentDate')
    .notEmpty()
    .withMessage('Establishment date is required')
    .isString()
    .withMessage('Establishment date must be a string'),

  body('leagueFounderUserId')
    .notEmpty()
    .withMessage('League founder user id is required')
    .isString()
    .withMessage('League founder user id must be a string'),
];
