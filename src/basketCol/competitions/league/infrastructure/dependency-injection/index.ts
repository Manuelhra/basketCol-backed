import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixLeagueDependencyInjector } from './awilix/AwilixLeagueDependencyInjector';

const awilixLeagueContainer = new AwilixLeagueDependencyInjector().getContainer();

if (awilixLeagueContainer === null) {
  throw new DependencyContainerNotInitializedError();
}

export const leagueServerErrorHandler = awilixLeagueContainer.resolve('leagueServerErrorHandler');
