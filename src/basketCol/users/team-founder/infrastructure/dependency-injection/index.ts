import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixTeamFounderUserDependencyInjector } from './awilix/AwilixTeamFounderUserDependencyInjector';

const awilixTeamFounderUserContainer = new AwilixTeamFounderUserDependencyInjector().getContainer();

if (awilixTeamFounderUserContainer === null) {
  throw new DependencyContainerNotInitializedError();
}

export const teamFounderUserServerErrorHandler = awilixTeamFounderUserContainer.resolve('teamFounderUserServerErrorHandler');
