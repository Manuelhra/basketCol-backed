import { DependencyContainerNotInitializedError } from '../../../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixLeagueSeasonAwardsDependencyInjector } from './awilix/AwilixLeagueSeasonAwardsDependencyInjector';

const awilixLeagueSeasonAwardsContainer = AwilixLeagueSeasonAwardsDependencyInjector.create().getContainer();

if (awilixLeagueSeasonAwardsContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const leagueSeasonAwardsRouteManager = awilixLeagueSeasonAwardsContainer.resolve('leagueSeasonAwardsRouteManager');
export const findLeagueSeasonAwardsByLeagueSeasonIdGETController = awilixLeagueSeasonAwardsContainer.resolve('findLeagueSeasonAwardsByLeagueSeasonIdGETController');
export const createLeagueSeasonAwardsPOSTController = awilixLeagueSeasonAwardsContainer.resolve('createLeagueSeasonAwardsPOSTController');
