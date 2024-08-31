import { DependencyContainerNotInitializedError } from '@basketcol/domain';

import { AwilixServerStatusDependencyInjector } from './awilix/AwilixServerStatusDependencyInjector';

const awilixServerStatusContainer = new AwilixServerStatusDependencyInjector().getContainer();

if (awilixServerStatusContainer === null) {
  throw new DependencyContainerNotInitializedError();
}

export const expressServerStatusGetController = awilixServerStatusContainer.resolve('expressServerStatusGetController');
export const expressServerStatusRouteManager = awilixServerStatusContainer.resolve('expressServerStatusRouteManager');
