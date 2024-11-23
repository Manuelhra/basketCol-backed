import { Request, Response } from 'express';
import { HttpStatus, Nullable, Team } from '@basketcol/domain';

import { ExpressBaseController } from '../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { IFindTeamByIdUseCase } from '../../../../application/use-cases/ports/IFindTeamByIdUseCase';
import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';

type Dependencies = {
  readonly findTeamByIdUseCase: IFindTeamByIdUseCase;
  readonly httpResponseHandler: IHttpResponseHandler;
};

export class ExpressFindTeamByIdGETController implements ExpressBaseController {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): ExpressFindTeamByIdGETController {
    return new ExpressFindTeamByIdGETController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const { teamId } = request.params;
    const team: Nullable<Team> = await this.dependencies.findTeamByIdUseCase.execute({ id: teamId });

    const successResult = this.dependencies.httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.OK,
      message: HttpStatus.getMessage(HttpStatus.OK),
      data: {
        team: team ? team.toPrimitives : null,
      },
    });

    response.status(HttpStatus.OK).json(successResult);
  }
}
