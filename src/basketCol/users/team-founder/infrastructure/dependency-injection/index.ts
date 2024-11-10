import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixTeamFounderUserDependencyInjector } from './awilix/AwilixTeamFounderUserDependencyInjector';

const awilixTeamFounderUserContainer = AwilixTeamFounderUserDependencyInjector.create().getContainer();

if (awilixTeamFounderUserContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const createTeamFounderUserPOSTController = awilixTeamFounderUserContainer.resolve('createTeamFounderUserPOSTController');
export const teamFounderUserRouteManager = awilixTeamFounderUserContainer.resolve('teamFounderUserRouteManager');
export const teamFounderUserServerErrorHandler = awilixTeamFounderUserContainer.resolve('teamFounderUserServerErrorHandler');
