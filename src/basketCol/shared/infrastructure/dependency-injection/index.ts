import { DependencyContainerNotInitializedError } from '@basketcol/domain';

import { AwilixSharedDependencyInjector } from './awilix/AwilixSharedDependencyInjector';

const awilixSharedContainer = new AwilixSharedDependencyInjector().getContainer();

if (awilixSharedContainer === null) {
  throw new DependencyContainerNotInitializedError();
}

export const expressSharedServerErrorHandler = awilixSharedContainer.resolve('expressSharedServerErrorHandler');
