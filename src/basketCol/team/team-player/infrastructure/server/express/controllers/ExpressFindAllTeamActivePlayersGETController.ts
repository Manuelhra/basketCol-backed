import { Request, Response } from 'express';
import { HttpStatus, TeamPlayer } from '@basketcol/domain';

import { ExpressBaseController } from '../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { IFindAllTeamActivePlayersUseCase } from '../../../../application/use-cases/ports/IFindAllTeamActivePlayersUseCase';
import { IHttpResponseHandler } from '../../../../../../shared/application/http/ports/IHttpResponseHandler';

type Dependencies = {
  readonly findAllTeamActivePlayersUseCase: IFindAllTeamActivePlayersUseCase;
  readonly httpResponseHandler: IHttpResponseHandler;
};

export class ExpressFindAllTeamActivePlayersGETController implements ExpressBaseController {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): ExpressFindAllTeamActivePlayersGETController {
    return new ExpressFindAllTeamActivePlayersGETController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const { teamId } = request.params;
    const teamPlayers: TeamPlayer[] = await this.dependencies.findAllTeamActivePlayersUseCase.execute({ teamId });

    const successResult = this.dependencies.httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.OK,
      message: HttpStatus.getMessage(HttpStatus.OK),
      data: {
        teamPlayers: teamPlayers.map((teamPlayer) => teamPlayer.toPrimitives),
      },
    });

    response.status(HttpStatus.OK).json(successResult);
  }
}
