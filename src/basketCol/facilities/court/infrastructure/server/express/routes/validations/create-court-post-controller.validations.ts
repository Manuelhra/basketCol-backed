import { body, ValidationChain } from 'express-validator';

export const createCourtPOSTControllerValidations: ValidationChain[] = [
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

  body('establishmentDate')
    .notEmpty()
    .withMessage('Establishment date is required')
    .isString()
    .withMessage('Establishment date must be a string'),

  body('surface')
    .notEmpty()
    .withMessage('Surface is required')
    .isString()
    .withMessage('Surface must be a string'),

  body('hoopHeight')
    .notEmpty()
    .withMessage('Hoop height is required')
    .isNumeric()
    .withMessage('Hoop height must be a number'),

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

  body('facilityId')
    .optional()
    .isString()
    .withMessage('Facility id must be a string'),
];
