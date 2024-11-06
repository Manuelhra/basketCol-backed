import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixLeagueFounderUserDependencyInjector } from './awilix/AwilixLeagueFounderUserDependencyInjector';

const awilixLeagueFounderUserContainer = AwilixLeagueFounderUserDependencyInjector.create().getContainer();

if (awilixLeagueFounderUserContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const createLeagueFounderUserPOSTController = awilixLeagueFounderUserContainer.resolve('createLeagueFounderUserPOSTController');
export const leagueFounderUserRouteManager = awilixLeagueFounderUserContainer.resolve('leagueFounderUserRouteManager');
export const leagueFounderUserServerErrorHandler = awilixLeagueFounderUserContainer.resolve('leagueFounderUserServerErrorHandler');
