import { DependencyContainerNotInitializedError } from '../exceptions/DependencyContainerNotInitializedError';
import { AwilixSharedDependencyInjector } from './awilix/AwilixSharedDependencyInjector';

const awilixSharedContainer = AwilixSharedDependencyInjector.create().getContainer();

if (awilixSharedContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const sharedServerErrorHandler = awilixSharedContainer.resolve('sharedServerErrorHandler');
export const httpResponseHandler = awilixSharedContainer.resolve('httpResponseHandler');
export const tokenValidatorService = awilixSharedContainer.resolve('tokenValidatorService');
