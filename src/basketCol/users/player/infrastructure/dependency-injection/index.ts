import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixPlayerUserDependencyInjector } from './awilix/AwilixPlayerUserDependencyInjector';

const awilixPlayerUserContainer = AwilixPlayerUserDependencyInjector.create().getContainer();

if (awilixPlayerUserContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const createPlayerUserPOSTController = awilixPlayerUserContainer.resolve('createPlayerUserPOSTController');
export const playerUserRouteManager = awilixPlayerUserContainer.resolve('playerUserRouteManager');
export const playerUserServerErrorHandler = awilixPlayerUserContainer.resolve('playerUserServerErrorHandler');
export const searchPlayerUsersGETController = awilixPlayerUserContainer.resolve('searchPlayerUsersGETController');
