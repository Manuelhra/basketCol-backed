import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixLeagueDependencyInjector } from './awilix/AwilixLeagueDependencyInjector';

const awilixLeagueContainer = AwilixLeagueDependencyInjector.create().getContainer();

if (awilixLeagueContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const leagueRouteManager = awilixLeagueContainer.resolve('leagueRouteManager');
export const createLeaguePOSTController = awilixLeagueContainer.resolve('createLeaguePOSTController');
export const leagueServerErrorHandler = awilixLeagueContainer.resolve('leagueServerErrorHandler');
