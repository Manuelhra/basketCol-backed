import { DependencyContainerNotInitializedError } from '../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixTeamDependencyInjector } from './awilix/AwilixTeamDependencyInjector';

const awilixTeamContainer = AwilixTeamDependencyInjector.create().getContainer();

if (awilixTeamContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const teamRouteManager = awilixTeamContainer.resolve('teamRouteManager');
export const createTeamPOSTController = awilixTeamContainer.resolve('createTeamPOSTController');
export const teamServerErrorHandler = awilixTeamContainer.resolve('teamServerErrorHandler');
