import { DependencyContainerNotInitializedError } from '../../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixPlayerUserCareerStatsDependencyInjector } from './awilix/AwilixPlayerUserCareerStatsDependencyInjector';

const awilixPlayerUserCareerStatsContainer = AwilixPlayerUserCareerStatsDependencyInjector.create().getContainer();

if (awilixPlayerUserCareerStatsContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const createPlayerUserCareerStatsPOSTController = awilixPlayerUserCareerStatsContainer.resolve('createPlayerUserCareerStatsPOSTController');
export const playerUserCareerStatsRouteManager = awilixPlayerUserCareerStatsContainer.resolve('playerUserCareerStatsRouteManager');
export const findCareerStatsByPlayerUserIdGETController = awilixPlayerUserCareerStatsContainer.resolve('findCareerStatsByPlayerUserIdGETController');
