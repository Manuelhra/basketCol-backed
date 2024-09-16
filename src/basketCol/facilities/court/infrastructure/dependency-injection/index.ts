import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixCourtDependencyInjector } from './awilix/AwilixCourtDependencyInjector';

const awilixCourtContainer = new AwilixCourtDependencyInjector().getContainer();

if (awilixCourtContainer === null) {
  throw new DependencyContainerNotInitializedError();
}

export const courtServerErrorHandler = awilixCourtContainer.resolve('courtServerErrorHandler');
