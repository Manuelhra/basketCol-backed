import { Request, Response } from 'express';
import { HttpStatus } from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { ExpressBaseController } from '../../../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { IFindAllLeagueSeasonFixturesByLeagueSeasonIdUseCase } from '../../../../application/use-cases/ports/IFindAllLeagueSeasonFixturesByLeagueSeasonIdUseCase';

type Dependencies = {
  readonly findAllLeagueSeasonFixturesByLeagueSeasonIdUseCase: IFindAllLeagueSeasonFixturesByLeagueSeasonIdUseCase;
  readonly httpResponseHandler: IHttpResponseHandler;
};

export class ExpressFindAllLeagueSeasonFixturesByLeagueSeasonIdGETController implements ExpressBaseController {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): ExpressFindAllLeagueSeasonFixturesByLeagueSeasonIdGETController {
    return new ExpressFindAllLeagueSeasonFixturesByLeagueSeasonIdGETController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const { leagueSeasonId } = request.params;
    const result = await this.dependencies.findAllLeagueSeasonFixturesByLeagueSeasonIdUseCase.execute({ leagueSeasonId });

    const successResult = this.dependencies.httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.OK,
      message: HttpStatus.getMessage(HttpStatus.OK),
      data: result !== null ? {
        leagueSeasonFixtures: result.leagueSeasonFixtures.map((leagueSeasonFixture) => ({
          ...leagueSeasonFixture.toPrimitives,
          leagueSeason: result.leagueSeason.toPrimitives,
        })),
      } : null,
    });

    response.status(HttpStatus.OK).json(successResult);
  }
}
