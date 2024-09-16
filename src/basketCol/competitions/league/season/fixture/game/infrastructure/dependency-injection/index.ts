import { DependencyContainerNotInitializedError } from '../../../../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixLeagueSeasonFixtureGameDependencyInjector } from './awilix/AwilixLeagueSeasonFixtureGameDependencyInjector';

const awilixLeagueSeasonFixtureGameContainer = new AwilixLeagueSeasonFixtureGameDependencyInjector().getContainer();

if (awilixLeagueSeasonFixtureGameContainer === null) {
  throw new DependencyContainerNotInitializedError();
}

export const leagueSeasonFixtureGameServerErrorHandler = awilixLeagueSeasonFixtureGameContainer.resolve('leagueSeasonFixtureGameServerErrorHandler');
