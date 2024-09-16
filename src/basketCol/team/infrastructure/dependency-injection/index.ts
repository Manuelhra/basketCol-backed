import { DependencyContainerNotInitializedError } from '../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixTeamDependencyInjector } from './awilix/AwilixTeamDependencyInjector';

const awilixTeamContainer = new AwilixTeamDependencyInjector().getContainer();

if (awilixTeamContainer === null) {
  throw new DependencyContainerNotInitializedError();
}

export const teamServerErrorHandler = awilixTeamContainer.resolve('teamServerErrorHandler');
