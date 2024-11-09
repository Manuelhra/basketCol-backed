import { DependencyContainerNotInitializedError } from '../../../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixLeagueSeasonFixtureDependencyInjector } from './awilix/AwilixLeagueSeasonFixtureDependencyInjector';

const awilixLeagueSeasonFixtureContainer = AwilixLeagueSeasonFixtureDependencyInjector.create().getContainer();

if (awilixLeagueSeasonFixtureContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const bulkCreateLeagueSeasonFixtureFromExcelPOSTController = awilixLeagueSeasonFixtureContainer.resolve('bulkCreateLeagueSeasonFixtureFromExcelPOSTController');
export const leagueSeasonFixtureRouteManager = awilixLeagueSeasonFixtureContainer.resolve('leagueSeasonFixtureRouteManager');
export const leagueSeasonFixtureServerErrorHandler = awilixLeagueSeasonFixtureContainer.resolve('leagueSeasonFixtureServerErrorHandler');
