import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixUsersSharedDependencyInjector } from './awilix/AwilixUsersSharedDependencyInjector';

const awilixUsersSharedContainer = AwilixUsersSharedDependencyInjector.create().getContainer();

if (awilixUsersSharedContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const usersSharedServerErrorHandler = awilixUsersSharedContainer.resolve('usersSharedServerErrorHandler');
