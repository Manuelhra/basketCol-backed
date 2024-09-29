import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixLeagueDependencyInjector } from './awilix/AwilixLeagueDependencyInjector';

const awilixLeagueContainer = AwilixLeagueDependencyInjector.create().getContainer();

if (awilixLeagueContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const leagueServerErrorHandler = awilixLeagueContainer.resolve('leagueServerErrorHandler');
