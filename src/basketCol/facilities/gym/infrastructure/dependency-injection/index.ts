import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixGymDependencyInjector } from './awilix/AwilixGymDependencyInjector';

const awilixGymContainer = AwilixGymDependencyInjector.create().getContainer();

if (awilixGymContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const gymRouteManager = awilixGymContainer.resolve('gymRouteManager');
export const createGymPOSTController = awilixGymContainer.resolve('createGymPOSTController');
export const gymServerErrorHandler = awilixGymContainer.resolve('gymServerErrorHandler');
export const searchGymsGETController = awilixGymContainer.resolve('searchGymsGETController');
