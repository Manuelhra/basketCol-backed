import { serverStatusRouteManager } from '../basketCol/server-status/infrastructure/dependency-injection';
import { sharedServerErrorHandler } from '../basketCol/shared/infrastructure/dependency-injection';
import { IServer } from '../basketCol/shared/infrastructure/server';
import { ExpressServer } from '../basketCol/shared/infrastructure/server/express/server/ExpressServer';
import { hostUserRouteManager } from '../basketCol/users/host/infrastructure/dependency-injection';
import { authenticationRouteManager, authenticationServerErrorHandler } from '../basketCol/authentication/infrastructure/dependency-injection';
import { usersSharedServerErrorHandler } from '../basketCol/users/shared/infrastructure/dependency-injection';
import { leagueFounderUserServerErrorHandler } from '../basketCol/users/league-founder/infrastructure/dependency-injection';
import { playerUserServerErrorHandler } from '../basketCol/users/player/infrastructure/dependency-injection';
import { refereeUserServerErrorHandler } from '../basketCol/users/referee/infrastructure/dependency-injection';
import { teamFounderUserServerErrorHandler } from '../basketCol/users/team-founder/infrastructure/dependency-injection';
import { teamServerErrorHandler } from '../basketCol/team/infrastructure/dependency-injection';
import { gymServerErrorHandler } from '../basketCol/facilities/gym/infrastructure/dependency-injection';
import { courtServerErrorHandler } from '../basketCol/facilities/court/infrastructure/dependency-injection';
import { competitionsSharedServerErrorHandler } from '../basketCol/competitions/shared/infrastructure/dependency-injection';
import { leagueServerErrorHandler } from '../basketCol/competitions/league/infrastructure/dependency-injection';
import { leagueSeasonServerErrorHandler } from '../basketCol/competitions/league/season/infrastructure/dependency-injection';
import { leagueSeasonFixtureServerErrorHandler } from '../basketCol/competitions/league/season/fixture/infrastructure/dependency-injection';
import { leagueSeasonFixtureGameServerErrorHandler } from '../basketCol/competitions/league/season/fixture/game/infrastructure/dependency-injection';

export class App {
  readonly #server: IServer;

  constructor() {
    this.#server = new ExpressServer();

    this.setUpRoutes();
    this.handleErrors();
  }

  public start(port: string): void {
    this.#server.listen(port);
  }

  public stop(): void {
    this.#server.stop();
  }

  private setUpRoutes(): void {
    this.#server.registerRoutes([
      serverStatusRouteManager,
      hostUserRouteManager,
      authenticationRouteManager,
    ]);
  }

  private handleErrors(): void {
    this.#server.handleErrors([
      sharedServerErrorHandler,
      authenticationServerErrorHandler,
      usersSharedServerErrorHandler,
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
    ]);
  }
}

// TODO: crear Either
