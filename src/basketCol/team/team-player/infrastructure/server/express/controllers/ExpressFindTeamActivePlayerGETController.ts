import { Request, Response } from 'express';
import { HttpStatus } from '@basketcol/domain';

import { ExpressBaseController } from '../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { IFindTeamActivePlayerUseCase } from '../../../../application/use-cases/ports/IFindTeamActivePlayerUseCase';
import { IHttpResponseHandler } from '../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { TeamPlayerHttpResponseDTO } from '../../../dtos/TeamPlayerHttpResponseDTO';

type Dependencies = {
  readonly findTeamActivePlayerUseCase: IFindTeamActivePlayerUseCase;
  readonly httpResponseHandler: IHttpResponseHandler;
};

export class ExpressFindTeamActivePlayerGETController implements ExpressBaseController {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): ExpressFindTeamActivePlayerGETController {
    return new ExpressFindTeamActivePlayerGETController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const { playerUserId } = request.params;
    const result = await this.dependencies.findTeamActivePlayerUseCase.execute({ playerUserId });

    const responseData: TeamPlayerHttpResponseDTO | null = result ? {
      ...result.teamPlayer.toPrimitives,
      playerUser: result.playerUserInfo.toPrimitives,
      team: result.teamInfo.toPrimitives,
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
