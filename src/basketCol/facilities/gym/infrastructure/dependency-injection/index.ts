import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixGymDependencyInjector } from './awilix/AwilixGymDependencyInjector';

const awilixGymContainer = new AwilixGymDependencyInjector().getContainer();

if (awilixGymContainer === null) {
  throw new DependencyContainerNotInitializedError();
}

export const gymServerErrorHandler = awilixGymContainer.resolve('gymServerErrorHandler');
