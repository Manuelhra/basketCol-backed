import { DependencyContainerNotInitializedError } from '../../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixLeagueTeamDependencyInjector } from './awilix/AwilixLeagueTeamDependencyInjector';

const awilixLeagueTeamContainer = AwilixLeagueTeamDependencyInjector.create().getContainer();

if (awilixLeagueTeamContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const createLeagueTeamPOSTController = awilixLeagueTeamContainer.resolve('createLeagueTeamPOSTController');
export const leagueTeamRouteManager = awilixLeagueTeamContainer.resolve('leagueTeamRouteManager');
export const leagueTeamServerErrorHandler = awilixLeagueTeamContainer.resolve('leagueTeamServerErrorHandler');
export const findAllLeagueTeamsByLeagueIdGETController = awilixLeagueTeamContainer.resolve('findAllLeagueTeamsByLeagueIdGETController');
