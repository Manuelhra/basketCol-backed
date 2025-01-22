import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixTeamAllTimeStatsDependencyInjector } from './awilix/AwilixTeamAllTimeStatsDependencyInjector';

const awilixTeamContainer = AwilixTeamAllTimeStatsDependencyInjector.create().getContainer();

if (awilixTeamContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const teamAllTimeStatsServerErrorHandler = awilixTeamContainer.resolve('teamAllTimeStatsServerErrorHandler');
