import { Request, Response } from 'express';
import { HttpStatus } from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { ExpressBaseController } from '../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { IFindPlayerUserByIdUseCase } from '../../../../application/use-cases/ports/IFindPlayerUserByIdUseCase';
import { PlayerUserHttpResponseDTO } from '../../../dtos/PlayerUserHttpResponseDTO';
import { PlayerUserCareerStatsHttpResponseDTO } from '../../../../career-stats/dtos/PlayerUserCareerStatsHttpResponseDTO';

type Dependencies = {
  readonly findPlayerUserByIdUseCase: IFindPlayerUserByIdUseCase;
  readonly httpResponseHandler: IHttpResponseHandler;
};

export class ExpressFindPlayerUserByIdGETController implements ExpressBaseController {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): ExpressFindPlayerUserByIdGETController {
    return new ExpressFindPlayerUserByIdGETController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const { playerUserId } = request.params;
    const result = await this.dependencies.findPlayerUserByIdUseCase.execute({ id: playerUserId });

    const responseData: {
      playerUser: PlayerUserHttpResponseDTO,
      playerUserCareerStats: PlayerUserCareerStatsHttpResponseDTO,
    } | null = result ? {
      playerUser: result.playerUser.toPrimitives,
      playerUserCareerStats: result.playerUserCareerStats.toPrimitives,
    } : null;

    const successResult = this.dependencies.httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.OK,
      message: HttpStatus.getMessage(HttpStatus.OK),
      data: responseData,
    });

    response.status(HttpStatus.OK).json(successResult);
  }
}
