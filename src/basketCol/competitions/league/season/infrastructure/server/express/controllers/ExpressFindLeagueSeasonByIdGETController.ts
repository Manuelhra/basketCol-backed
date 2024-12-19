import { Request, Response } from 'express';
import { HttpStatus } from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { ExpressBaseController } from '../../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { IFindLeagueSeasonByIdUseCase } from '../../../../application/use-cases/ports/IFindLeagueSeasonByIdUseCase';

type Dependencies = {
  readonly findLeagueSeasonByIdUseCase: IFindLeagueSeasonByIdUseCase;
  readonly httpResponseHandler: IHttpResponseHandler;
};

export class ExpressFindLeagueSeasonByIdGETController implements ExpressBaseController {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): ExpressFindLeagueSeasonByIdGETController {
    return new ExpressFindLeagueSeasonByIdGETController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const { leagueSeasonId } = request.params;

    const result = await this.dependencies.findLeagueSeasonByIdUseCase.execute({ id: leagueSeasonId });

    const successResult = this.dependencies.httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.OK,
      message: HttpStatus.getMessage(HttpStatus.OK),
      data: {
        leagueSeason: result !== null ? {
          ...result.leagueSeason.toPrimitives,
          league: result.league.toPrimitives,
        } : null,
      },
    });

    response.status(HttpStatus.OK).json(successResult);
  }
}
