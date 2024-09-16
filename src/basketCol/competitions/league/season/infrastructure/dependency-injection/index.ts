import { DependencyContainerNotInitializedError } from '../../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixLeagueSeasonDependencyInjector } from './awilix/AwilixLeagueSeasonDependencyInjector';

const awilixLeagueSeasonContainer = new AwilixLeagueSeasonDependencyInjector().getContainer();

if (awilixLeagueSeasonContainer === null) {
  throw new DependencyContainerNotInitializedError();
}

export const leagueSeasonServerErrorHandler = awilixLeagueSeasonContainer.resolve('leagueSeasonServerErrorHandler');
