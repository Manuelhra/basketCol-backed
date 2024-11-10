import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixRefereeUserDependencyInjector } from './awilix/AwilixRefereeUserDependencyInjector';

const awilixRefereeUserContainer = AwilixRefereeUserDependencyInjector.create().getContainer();

if (awilixRefereeUserContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const createRefereeUserPOSTController = awilixRefereeUserContainer.resolve('createRefereeUserPOSTController');
export const refereeUserRouteManager = awilixRefereeUserContainer.resolve('refereeUserRouteManager');
export const refereeUserServerErrorHandler = awilixRefereeUserContainer.resolve('refereeUserServerErrorHandler');
