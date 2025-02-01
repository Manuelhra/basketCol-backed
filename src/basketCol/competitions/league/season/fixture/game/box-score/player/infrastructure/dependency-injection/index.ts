import { DependencyContainerNotInitializedError } from '../../../../../../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixPlayerUserLeagueSeasonFixtureGameBoxScoreDependencyInjector } from './awilix/AwilixPlayerUserLeagueSeasonFixtureGameBoxScoreDependencyInjector';

const awilixPlayerUserLeagueSeasonFixtureGameBoxScoreContainer = AwilixPlayerUserLeagueSeasonFixtureGameBoxScoreDependencyInjector.create().getContainer();

if (awilixPlayerUserLeagueSeasonFixtureGameBoxScoreContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const playerUserLeagueSeasonFixtureGameBoxScoreRouteManager = awilixPlayerUserLeagueSeasonFixtureGameBoxScoreContainer.resolve('playerUserLeagueSeasonFixtureGameBoxScoreRouteManager');
export const bulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController = awilixPlayerUserLeagueSeasonFixtureGameBoxScoreContainer.resolve('bulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController');
export const playerUserLeagueSeasonFixtureGameBoxScoreServerErrorHandler = awilixPlayerUserLeagueSeasonFixtureGameBoxScoreContainer.resolve('playerUserLeagueSeasonFixtureGameBoxScoreServerErrorHandler');
