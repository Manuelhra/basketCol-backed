import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixTeamPlayerDependencyInjector } from './awilix/AwilixTeamPlayerDependencyInjector';

const awilixTeamPlayerContainer = AwilixTeamPlayerDependencyInjector.create().getContainer();

if (awilixTeamPlayerContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const teamPlayerRouteManager = awilixTeamPlayerContainer.resolve('teamPlayerRouteManager');
export const bulkCreateTeamPlayerFromExcelPOSTController = awilixTeamPlayerContainer.resolve('bulkCreateTeamPlayerFromExcelPOSTController');
export const teamPlayerServerErrorHandler = awilixTeamPlayerContainer.resolve('teamPlayerServerErrorHandler');
export const findAllTeamActivePlayersGETController = awilixTeamPlayerContainer.resolve('findAllTeamActivePlayersGETController');
