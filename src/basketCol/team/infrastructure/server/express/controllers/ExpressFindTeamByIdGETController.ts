import { Request, Response } from 'express';
import { HttpStatus } from '@basketcol/domain';

import { ExpressBaseController } from '../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { IFindTeamByIdUseCase } from '../../../../application/use-cases/ports/IFindTeamByIdUseCase';
import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { TeamHttpResponseDTO } from '../../../dtos/TeamHttpResponseDTO';
import { TeamAllTimeStatsHttpResponseDTO } from '../../../../all-time-stats/infrastructure/dtos/TeamAllTimeStatsHttpResponseDTO';

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
    const result = await this.dependencies.findTeamByIdUseCase.execute({ id: teamId });

    const responseData: {
      team: TeamHttpResponseDTO,
      teamAllTimeStats: TeamAllTimeStatsHttpResponseDTO,
    } | null = result ? {
      team: result.team.toPrimitives,
      teamAllTimeStats: result.teamAllTimeStats.toPrimitives,
    } : null;

    const successResult = this.dependencies.httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.OK,
      message: HttpStatus.getMessage(HttpStatus.OK),
      data: responseData,
    });

    response.status(HttpStatus.OK).json(successResult);
  }
}
