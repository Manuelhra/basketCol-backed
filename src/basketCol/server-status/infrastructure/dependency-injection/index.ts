import { DependencyContainerNotInitializedError } from '../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixServerStatusDependencyInjector } from './awilix/AwilixServerStatusDependencyInjector';

const awilixServerStatusContainer = AwilixServerStatusDependencyInjector.create().getContainer();

if (awilixServerStatusContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const serverStatusGETController = awilixServerStatusContainer.resolve('serverStatusGETController');
export const serverStatusRouteManager = awilixServerStatusContainer.resolve('serverStatusRouteManager');
