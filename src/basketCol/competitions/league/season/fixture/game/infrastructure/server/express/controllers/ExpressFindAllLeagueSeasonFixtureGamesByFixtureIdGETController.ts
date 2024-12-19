import { Request, Response } from 'express';
import { HttpStatus } from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { ExpressBaseController } from '../../../../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { IFindAllLeagueSeasonFixtureGamesByFixtureIdUseCase } from '../../../../application/use-cases/ports/IFindAllLeagueSeasonFixtureGamesByFixtureIdUseCase';

type Dependencies = {
  readonly findAllLeagueSeasonFixtureGamesByFixtureIdUseCase: IFindAllLeagueSeasonFixtureGamesByFixtureIdUseCase;
  readonly httpResponseHandler: IHttpResponseHandler;
};

export class ExpressFindAllLeagueSeasonFixtureGamesByFixtureIdGETController
implements ExpressBaseController {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): ExpressFindAllLeagueSeasonFixtureGamesByFixtureIdGETController {
    return new ExpressFindAllLeagueSeasonFixtureGamesByFixtureIdGETController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const { fixtureId } = request.params;
    const result = await this.dependencies
      .findAllLeagueSeasonFixtureGamesByFixtureIdUseCase
      .execute({ fixtureId });

    const successResult = this.dependencies.httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.OK,
      message: HttpStatus.getMessage(HttpStatus.OK),
      data: {
        leagueSeasonFixtureGames: result.leagueSeasonFixtureGames.map((game) => ({
          ...game.toPrimitives,
          homeTeam: result.teamList
            .find((team) => team.toPrimitives.id === game.toPrimitives.homeTeamId)
            ?.toPrimitives,
          awayTeam: result.teamList
            .find((team) => team.toPrimitives.id === game.toPrimitives.awayTeamId)
            ?.toPrimitives,
        })),
      },
    });

    response.status(HttpStatus.OK).json(successResult);
  }
}
