import { Request, Response } from 'express';
import { HttpStatus } from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { ExpressBaseController } from '../../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { IFindAllLeagueSeasonsByLeagueIdUseCase } from '../../../../application/use-cases/ports/IFindAllLeagueSeasonsByLeagueIdUseCase';

type Dependencies = {
  readonly findAllLeagueSeasonsByLeagueIdUseCase: IFindAllLeagueSeasonsByLeagueIdUseCase;
  readonly httpResponseHandler: IHttpResponseHandler;
};

export class ExpressFindAllLeagueSeasonsByLeagueIdGETController implements ExpressBaseController {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): ExpressFindAllLeagueSeasonsByLeagueIdGETController {
    return new ExpressFindAllLeagueSeasonsByLeagueIdGETController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const { leagueId } = request.params;
    const leagueSeasons = await this.dependencies.findAllLeagueSeasonsByLeagueIdUseCase.execute({ leagueId });

    const successResult = this.dependencies.httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.OK,
      message: HttpStatus.getMessage(HttpStatus.OK),
      data: {
        leagueSeasons: leagueSeasons.map((leagueSeason) => leagueSeason.toPrimitives),
      },
    });

    response.status(HttpStatus.OK).json(successResult);
  }
}
