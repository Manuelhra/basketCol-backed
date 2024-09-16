import { DependencyContainerNotInitializedError } from '../exceptions/DependencyContainerNotInitializedError';
import { AwilixSharedDependencyInjector } from './awilix/AwilixSharedDependencyInjector';

const awilixSharedContainer = new AwilixSharedDependencyInjector().getContainer();

if (awilixSharedContainer === null) {
  throw new DependencyContainerNotInitializedError();
}

export const sharedServerErrorHandler = awilixSharedContainer.resolve('sharedServerErrorHandler');
