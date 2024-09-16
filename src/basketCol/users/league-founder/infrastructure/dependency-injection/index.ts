import { DependencyContainerNotInitializedError } from '../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixLeagueFounderUserDependencyInjector } from './awilix/AwilixLeagueFounderUserDependencyInjector';

const awilixLeagueFounderUserContainer = new AwilixLeagueFounderUserDependencyInjector().getContainer();

if (awilixLeagueFounderUserContainer === null) {
  throw new DependencyContainerNotInitializedError();
}

export const leagueFounderUserServerErrorHandler = awilixLeagueFounderUserContainer.resolve('leagueFounderUserServerErrorHandler');
