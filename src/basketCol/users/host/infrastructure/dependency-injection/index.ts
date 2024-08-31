import { DependencyContainerNotInitializedError } from '@basketcol/domain';

import { AwilixHostUserDependencyInjector } from './awilix/AwilixHostUserDependencyInjector';

const awilixHostUserContainer = new AwilixHostUserDependencyInjector().getContainer();

if (awilixHostUserContainer === null) {
  throw new DependencyContainerNotInitializedError();
}

export const expressHostUserPostController = awilixHostUserContainer.resolve('expressHostUserPostController');
export const expressHostUserRouteManager = awilixHostUserContainer.resolve('expressHostUserRouteManager');
