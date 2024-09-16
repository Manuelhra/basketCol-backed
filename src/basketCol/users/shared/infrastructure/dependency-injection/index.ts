import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixUsersSharedDependencyInjector } from './awilix/AwilixUsersSharedDependencyInjector';

const awilixUsersSharedContainer = new AwilixUsersSharedDependencyInjector().getContainer();

if (awilixUsersSharedContainer === null) {
  throw new DependencyContainerNotInitializedError();
}

export const usersSharedServerErrorHandler = awilixUsersSharedContainer.resolve('usersSharedServerErrorHandler');
