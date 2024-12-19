import { DependencyContainerNotInitializedError } from '../../../../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixLeagueSeasonFixtureGameDependencyInjector } from './awilix/AwilixLeagueSeasonFixtureGameDependencyInjector';

const awilixLeagueSeasonFixtureGameContainer = AwilixLeagueSeasonFixtureGameDependencyInjector.create().getContainer();

if (awilixLeagueSeasonFixtureGameContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const bulkCreateLeagueSeasonFixtureGameFromExcelPOSTController = awilixLeagueSeasonFixtureGameContainer.resolve('bulkCreateLeagueSeasonFixtureGameFromExcelPOSTController');
export const leagueSeasonFixtureGameRouteManager = awilixLeagueSeasonFixtureGameContainer.resolve('leagueSeasonFixtureGameRouteManager');
export const leagueSeasonFixtureGameServerErrorHandler = awilixLeagueSeasonFixtureGameContainer.resolve('leagueSeasonFixtureGameServerErrorHandler');
export const findAllLeagueSeasonFixtureGamesByFixtureIdGETController = awilixLeagueSeasonFixtureGameContainer.resolve('findAllLeagueSeasonFixtureGamesByFixtureIdGETController');
