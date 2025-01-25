import { DependencyContainerNotInitializedError } from '../../../../../../../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixTeamLeagueSeasonFixtureGameBoxScoreDependencyInjector } from './awilix/AwilixTeamLeagueSeasonFixtureGameBoxScoreDependencyInjector';

const awilixTeamLeagueSeasonFixtureGameBoxScoreContainer = AwilixTeamLeagueSeasonFixtureGameBoxScoreDependencyInjector.create().getContainer();

if (awilixTeamLeagueSeasonFixtureGameBoxScoreContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const teamLeagueSeasonFixtureGameBoxScoreRouteManager = awilixTeamLeagueSeasonFixtureGameBoxScoreContainer.resolve('teamLeagueSeasonFixtureGameBoxScoreRouteManager');
export const bulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController = awilixTeamLeagueSeasonFixtureGameBoxScoreContainer.resolve('bulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController');
export const teamLeagueSeasonFixtureGameBoxScoreServerErrorHandler = awilixTeamLeagueSeasonFixtureGameBoxScoreContainer.resolve('teamLeagueSeasonFixtureGameBoxScoreServerErrorHandler');
