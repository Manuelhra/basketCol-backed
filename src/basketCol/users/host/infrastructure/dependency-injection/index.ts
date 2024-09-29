import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixHostUserDependencyInjector } from './awilix/AwilixHostUserDependencyInjector';

const awilixHostUserContainer = AwilixHostUserDependencyInjector.create().getContainer();

if (awilixHostUserContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const createHostUserPOSTController = awilixHostUserContainer.resolve('createHostUserPOSTController');
export const hostUserRouteManager = awilixHostUserContainer.resolve('hostUserRouteManager');
export const hostUserServerErrorHandler = awilixHostUserContainer.resolve('hostUserServerErrorHandler');
