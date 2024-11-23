import { Request, Response } from 'express';
import { HttpStatus, Nullable, PlayerUserCareerStats } from '@basketcol/domain';

import { ExpressBaseController } from '../../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { IFindCareerStatsByPlayerUserIdUseCase } from '../../../../application/use-cases/ports/IFindCareerStatsByPlayerUserIdUseCase';
import { IHttpResponseHandler } from '../../../../../../../shared/application/http/ports/IHttpResponseHandler';

type Dependencies = {
  readonly findCareerStatsByPlayerUserIdUseCase: IFindCareerStatsByPlayerUserIdUseCase;
  readonly httpResponseHandler: IHttpResponseHandler;
};

export class ExpressFindCareerStatsByPlayerUserIdGETController implements ExpressBaseController {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): ExpressFindCareerStatsByPlayerUserIdGETController {
    return new ExpressFindCareerStatsByPlayerUserIdGETController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const { playerUserId } = request.params;
    const playerUserCareerStats: Nullable<PlayerUserCareerStats> = await this.dependencies.findCareerStatsByPlayerUserIdUseCase.execute({ playerUserId });

    const successResult = this.dependencies.httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.OK,
      message: HttpStatus.getMessage(HttpStatus.OK),
      data: {
        playerUserCareerStats: playerUserCareerStats ? playerUserCareerStats.toPrimitives : null,
      },
    });

    response.status(HttpStatus.OK).json(successResult);
  }
}
