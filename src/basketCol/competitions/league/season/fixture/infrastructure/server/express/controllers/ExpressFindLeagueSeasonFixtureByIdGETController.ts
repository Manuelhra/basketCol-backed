import { Request, Response } from 'express';
import { HttpStatus } from '@basketcol/domain';

import { ExpressBaseController } from '../../../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { IFindLeagueSeasonFixtureByIdUseCase } from '../../../../application/use-cases/ports/IFindLeagueSeasonFixtureByIdUseCase';
import { IHttpResponseHandler } from '../../../../../../../../shared/application/http/ports/IHttpResponseHandler';

type Dependencies = {
  readonly findLeagueSeasonFixtureByIdUseCase: IFindLeagueSeasonFixtureByIdUseCase
  readonly httpResponseHandler: IHttpResponseHandler;
};

export class ExpressFindLeagueSeasonFixtureByIdGETController
implements ExpressBaseController {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): ExpressFindLeagueSeasonFixtureByIdGETController {
    return new ExpressFindLeagueSeasonFixtureByIdGETController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const { leagueSeasonFixtureId } = request.params;
    const result = await this.dependencies.findLeagueSeasonFixtureByIdUseCase.execute({ id: leagueSeasonFixtureId });

    const successResult = this.dependencies.httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.OK,
      message: HttpStatus.getMessage(HttpStatus.OK),
      data: result !== null ? {
        leagueSeasonFixture: {
          ...result.leagueSeasonFixture.toPrimitives,
          leagueSeason: result.leagueSeason.toPrimitives,
        },
      } : null,
    });

    response.status(HttpStatus.OK).json(successResult);
  }
}
