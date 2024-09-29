import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixRefereeUserDependencyInjector } from './awilix/AwilixRefereeUserDependencyInjector';

const awilixRefereeUserContainer = AwilixRefereeUserDependencyInjector.create().getContainer();

if (awilixRefereeUserContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const refereeUserServerErrorHandler = awilixRefereeUserContainer.resolve('refereeUserServerErrorHandler');
