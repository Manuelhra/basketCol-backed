import { serverStatusRouteManager } from '../basketCol/server-status/infrastructure/dependency-injection';
import { sharedServerErrorHandler } from '../basketCol/shared/infrastructure/dependency-injection';
import { IServer } from '../basketCol/shared/infrastructure/server';
import { hostUserRouteManager, hostUserServerErrorHandler } from '../basketCol/users/host/infrastructure/dependency-injection';
import { authenticationRouteManager, authenticationServerErrorHandler } from '../basketCol/authentication/infrastructure/dependency-injection';
import { usersSharedServerErrorHandler } from '../basketCol/users/shared/infrastructure/dependency-injection';
import { leagueFounderUserRouteManager, leagueFounderUserServerErrorHandler } from '../basketCol/users/league-founder/infrastructure/dependency-injection';
import { playerUserRouteManager, playerUserServerErrorHandler } from '../basketCol/users/player/infrastructure/dependency-injection';
import { refereeUserRouteManager, refereeUserServerErrorHandler } from '../basketCol/users/referee/infrastructure/dependency-injection';
import { teamFounderUserRouteManager, teamFounderUserServerErrorHandler } from '../basketCol/users/team-founder/infrastructure/dependency-injection';
import { teamRouteManager, teamServerErrorHandler } from '../basketCol/team/infrastructure/dependency-injection';
import { gymRouteManager, gymServerErrorHandler } from '../basketCol/facilities/gym/infrastructure/dependency-injection';
import { courtRouteManager, courtServerErrorHandler } from '../basketCol/facilities/court/infrastructure/dependency-injection';
import { competitionsSharedServerErrorHandler } from '../basketCol/competitions/shared/infrastructure/dependency-injection';
import { leagueRouteManager, leagueServerErrorHandler } from '../basketCol/competitions/league/infrastructure/dependency-injection';
import { leagueSeasonRouteManager, leagueSeasonServerErrorHandler } from '../basketCol/competitions/league/season/infrastructure/dependency-injection';
import { leagueSeasonFixtureRouteManager, leagueSeasonFixtureServerErrorHandler } from '../basketCol/competitions/league/season/fixture/infrastructure/dependency-injection';
import { leagueSeasonFixtureGameRouteManager, leagueSeasonFixtureGameServerErrorHandler } from '../basketCol/competitions/league/season/fixture/game/infrastructure/dependency-injection';
import { ExpressServer } from '../basketCol/shared/infrastructure/server/express/ExpressServer';
import { playerUserCareerStatsRouteManager } from '../basketCol/users/player/career-stats/infrastructure/dependency-injection';
import { playerUserAttributesRouteManager } from '../basketCol/users/player/attributes/shared/infrastructure/dependency-injection';
import { teamPlayerRouteManager, teamPlayerServerErrorHandler } from '../basketCol/team/team-player/infrastructure/dependency-injection';
import { leagueTeamRouteManager, leagueTeamServerErrorHandler } from '../basketCol/competitions/league/league-team/infrastructure/dependency-injection';
import { leagueSeasonAwardsRouteManager } from '../basketCol/competitions/league/season/awards/infrastructure/dependency-injection';
import { teamAllTimeStatsServerErrorHandler } from '../basketCol/team/all-time-stats/infrastructure/dependency-injection';
import { teamLeagueSeasonFixtureGameBoxScoreRouteManager } from '../basketCol/competitions/league/season/fixture/game/box-score/team/infrastructure/dependency-injection';

export class App {
  readonly #server: IServer;

  private constructor() {
    this.#server = ExpressServer.create();

    this.#setUpRoutes();
    this.#handleErrors();
  }

  public start(port: string): void {
    this.#server.listen(port);
  }

  public stop(): void {
    this.#server.stop();
  }

  public static create(): App {
    return new App();
  }

  #setUpRoutes(): void {
    this.#server.registerRoutes([
      serverStatusRouteManager,
      hostUserRouteManager,
      authenticationRouteManager,
      playerUserRouteManager,
      playerUserCareerStatsRouteManager,
      playerUserAttributesRouteManager,
      courtRouteManager,
      gymRouteManager,
      leagueRouteManager,
      leagueFounderUserRouteManager,
      leagueSeasonRouteManager,
      leagueSeasonFixtureRouteManager,
      refereeUserRouteManager,
      teamFounderUserRouteManager,
      leagueSeasonFixtureGameRouteManager,
      teamRouteManager,
      teamPlayerRouteManager,
      leagueTeamRouteManager,
      leagueSeasonAwardsRouteManager,
      teamLeagueSeasonFixtureGameBoxScoreRouteManager,
    ]);
  }

  #handleErrors(): void {
    this.#server.handleErrors([
      sharedServerErrorHandler,
      authenticationServerErrorHandler,
      usersSharedServerErrorHandler,
      hostUserServerErrorHandler,
      leagueFounderUserServerErrorHandler,
      playerUserServerErrorHandler,
      refereeUserServerErrorHandler,
      teamFounderUserServerErrorHandler,
      teamServerErrorHandler,
      gymServerErrorHandler,
      courtServerErrorHandler,
      competitionsSharedServerErrorHandler,
      leagueServerErrorHandler,
      leagueSeasonServerErrorHandler,
      leagueSeasonFixtureServerErrorHandler,
      leagueSeasonFixtureGameServerErrorHandler,
      teamPlayerServerErrorHandler,
      leagueTeamServerErrorHandler,
      teamAllTimeStatsServerErrorHandler,
    ]);
  }
}
