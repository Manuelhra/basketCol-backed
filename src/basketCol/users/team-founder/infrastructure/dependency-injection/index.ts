import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixTeamFounderUserDependencyInjector } from './awilix/AwilixTeamFounderUserDependencyInjector';

const awilixTeamFounderUserContainer = AwilixTeamFounderUserDependencyInjector.create().getContainer();

if (awilixTeamFounderUserContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const teamFounderUserServerErrorHandler = awilixTeamFounderUserContainer.resolve('teamFounderUserServerErrorHandler');
