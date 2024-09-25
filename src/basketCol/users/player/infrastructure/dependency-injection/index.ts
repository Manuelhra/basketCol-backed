import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixPlayerUserDependencyInjector } from './awilix/AwilixPlayerUserDependencyInjector';

const awilixPlayerUserContainer = new AwilixPlayerUserDependencyInjector().getContainer();

if (awilixPlayerUserContainer === null) {
  throw new DependencyContainerNotInitializedError();
}

export const playerUserServerErrorHandler = awilixPlayerUserContainer.resolve('playerUserServerErrorHandler');
export const createPlayerUserPOSTController = awilixPlayerUserContainer.resolve('createPlayerUserPOSTController');
export const playerUserRouteManager = awilixPlayerUserContainer.resolve('playerUserRouteManager');
