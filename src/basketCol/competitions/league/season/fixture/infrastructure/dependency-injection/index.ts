import { DependencyContainerNotInitializedError } from '../../../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixLeagueSeasonFixtureDependencyInjector } from './awilix/AwilixLeagueSeasonFixtureDependencyInjector';

const awilixLeagueSeasonFixtureContainer = new AwilixLeagueSeasonFixtureDependencyInjector().getContainer();

if (awilixLeagueSeasonFixtureContainer === null) {
  throw new DependencyContainerNotInitializedError();
}

export const leagueSeasonFixtureServerErrorHandler = awilixLeagueSeasonFixtureContainer.resolve('leagueSeasonFixtureServerErrorHandler');
