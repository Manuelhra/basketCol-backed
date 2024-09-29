import { DependencyContainerNotInitializedError } from '../../../../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixLeagueSeasonFixtureGameDependencyInjector } from './awilix/AwilixLeagueSeasonFixtureGameDependencyInjector';

const awilixLeagueSeasonFixtureGameContainer = AwilixLeagueSeasonFixtureGameDependencyInjector.create().getContainer();

if (awilixLeagueSeasonFixtureGameContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const leagueSeasonFixtureGameServerErrorHandler = awilixLeagueSeasonFixtureGameContainer.resolve('leagueSeasonFixtureGameServerErrorHandler');
