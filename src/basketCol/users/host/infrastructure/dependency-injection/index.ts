import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixHostUserDependencyInjector } from './awilix/AwilixHostUserDependencyInjector';

const awilixHostUserContainer = new AwilixHostUserDependencyInjector().getContainer();

if (awilixHostUserContainer === null) {
  throw new DependencyContainerNotInitializedError();
}

export const hostUserPOSTController = awilixHostUserContainer.resolve('hostUserPOSTController');
export const hostUserRouteManager = awilixHostUserContainer.resolve('hostUserRouteManager');
export const hostUserServerErrorHandler = awilixHostUserContainer.resolve('hostUserServerErrorHandler');
