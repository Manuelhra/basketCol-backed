import { DependencyContainerNotInitializedError } from '../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixServerStatusDependencyInjector } from './awilix/AwilixServerStatusDependencyInjector';

const awilixServerStatusContainer = new AwilixServerStatusDependencyInjector().getContainer();

if (awilixServerStatusContainer === null) {
  throw new DependencyContainerNotInitializedError();
}

export const serverStatusGETController = awilixServerStatusContainer.resolve('serverStatusGETController');
export const serverStatusRouteManager = awilixServerStatusContainer.resolve('serverStatusRouteManager');
