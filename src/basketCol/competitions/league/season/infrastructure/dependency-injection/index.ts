import { DependencyContainerNotInitializedError } from '../../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixLeagueSeasonDependencyInjector } from './awilix/AwilixLeagueSeasonDependencyInjector';

const awilixLeagueSeasonContainer = AwilixLeagueSeasonDependencyInjector.create().getContainer();

if (awilixLeagueSeasonContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const createLeagueSeasonPOSTController = awilixLeagueSeasonContainer.resolve('createLeagueSeasonPOSTController');
export const leagueSeasonRouteManager = awilixLeagueSeasonContainer.resolve('leagueSeasonRouteManager');
export const leagueSeasonServerErrorHandler = awilixLeagueSeasonContainer.resolve('leagueSeasonServerErrorHandler');
export const findAllLeagueSeasonsByLeagueIdGETController = awilixLeagueSeasonContainer.resolve('findAllLeagueSeasonsByLeagueIdGETController');
