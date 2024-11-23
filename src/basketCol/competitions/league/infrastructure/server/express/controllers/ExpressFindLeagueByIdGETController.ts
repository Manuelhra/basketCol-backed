import { Request, Response } from 'express';
import { HttpStatus, League, Nullable } from '@basketcol/domain';

import { ExpressBaseController } from '../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { IFindLeagueByIdUseCase } from '../../../../application/use-cases/ports/IFindLeagueByIdUseCase';
import { IHttpResponseHandler } from '../../../../../../shared/application/http/ports/IHttpResponseHandler';

type Dependencies = {
  readonly findLeagueByIdUseCase: IFindLeagueByIdUseCase;
  readonly httpResponseHandler: IHttpResponseHandler;
};

export class ExpressFindLeagueByIdGETController implements ExpressBaseController {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): ExpressFindLeagueByIdGETController {
    return new ExpressFindLeagueByIdGETController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const { leagueId } = request.params;
    const league: Nullable<League> = await this.dependencies.findLeagueByIdUseCase.execute({ id: leagueId });

    const successResult = this.dependencies.httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.OK,
      message: HttpStatus.getMessage(HttpStatus.OK),
      data: {
        league: league ? league.toPrimitives : null,
      },
    });

    response.status(HttpStatus.OK).json(successResult);
  }
}
