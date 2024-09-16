import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixRefereeUserDependencyInjector } from './awilix/AwilixRefereeUserDependencyInjector';

const awilixRefereeUserContainer = new AwilixRefereeUserDependencyInjector().getContainer();

if (awilixRefereeUserContainer === null) {
  throw new DependencyContainerNotInitializedError();
}

export const refereeUserServerErrorHandler = awilixRefereeUserContainer.resolve('refereeUserServerErrorHandler');
