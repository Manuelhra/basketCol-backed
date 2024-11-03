import { body, ValidationChain } from 'express-validator';

export const createPlayerUserCareerStatsPOSTControllerValidations: ValidationChain[] = [
  body('id')
    .notEmpty()
    .withMessage('Id is required')
    .isString()
    .withMessage('Id must be a string'),

  body('totalGamesPlayed')
    .notEmpty()
    .withMessage('Total games played is required')
    .isNumeric()
    .withMessage('Total games played must be a number'),

  body('totalGamesWon')
    .notEmpty()
    .withMessage('Total games won is required')
    .isNumeric()
    .withMessage('Total games won must be a number'),

  body('totalSeasonsLeaguePlayed')
    .notEmpty()
    .withMessage('Total seasons league played is required')
    .isNumeric()
    .withMessage('Total seasons league played must be a number'),

  body('totalSeasonsLeagueWon')
    .notEmpty()
    .withMessage('Total seasons league won is required')
    .isNumeric()
    .withMessage('Total seasons league won must be a number'),

  body('totalPoints')
    .notEmpty()
    .withMessage('Total points is required')
    .isNumeric()
    .withMessage('Total points must be a number'),

  body('totalOffensiveRebounds')
    .notEmpty()
    .withMessage('Total offensive rebounds is required')
    .isNumeric()
    .withMessage('Total offensive rebounds must be a number'),

  body('totalDefensiveRebounds')
    .notEmpty()
    .withMessage('Total defensive rebounds is required')
    .isNumeric()
    .withMessage('Total defensive rebounds must be a number'),

  body('totalAssists')
    .notEmpty()
    .withMessage('Total assists is required')
    .isNumeric()
    .withMessage('Total assists must be a number'),

  body('totalSteals')
    .notEmpty()
    .withMessage('Total steals is required')
    .isNumeric()
    .withMessage('Total steals must be a number'),

  body('totalBlocks')
    .notEmpty()
    .withMessage('Total blocks is required')
    .isNumeric()
    .withMessage('Total blocks must be a number'),

  body('totalFouls')
    .notEmpty()
    .withMessage('Total fouls is required')
    .isNumeric()
    .withMessage('Total fouls must be a number'),

  body('totalTurnovers')
    .notEmpty()
    .withMessage('Total turnovers is required')
    .isNumeric()
    .withMessage('Total turnovers must be a number'),

  body('totalThreePointersAttempted')
    .notEmpty()
    .withMessage('Total three-pointers attempted is required')
    .isNumeric()
    .withMessage('Total three-pointers attempted must be a number'),

  body('totalThreePointersMade')
    .notEmpty()
    .withMessage('Total three-pointers made is required')
    .isNumeric()
    .withMessage('Total three-pointers made must be a number'),

  body('totalFreeThrowsAttempted')
    .notEmpty()
    .withMessage('Total free throws attempted is required')
    .isNumeric()
    .withMessage('Total free throws attempted must be a number'),

  body('totalFreeThrowsMade')
    .notEmpty()
    .withMessage('Total free throws made is required')
    .isNumeric()
    .withMessage('Total free throws made must be a number'),

  body('totalFieldGoalsAttempted')
    .notEmpty()
    .withMessage('Total field goals attempted is required')
    .isNumeric()
    .withMessage('Total field goals attempted must be a number'),

  body('totalFieldGoalsMade')
    .notEmpty()
    .withMessage('Total field goals made is required')
    .isNumeric()
    .withMessage('Total field goals made must be a number'),
];
