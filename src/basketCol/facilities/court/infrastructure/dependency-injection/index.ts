import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixCourtDependencyInjector } from './awilix/AwilixCourtDependencyInjector';

const awilixCourtContainer = AwilixCourtDependencyInjector.create().getContainer();

if (awilixCourtContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const courtServerErrorHandler = awilixCourtContainer.resolve('courtServerErrorHandler');
