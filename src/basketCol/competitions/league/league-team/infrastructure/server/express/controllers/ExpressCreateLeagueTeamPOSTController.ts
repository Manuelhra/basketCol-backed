import { Request, Response } from 'express';
import { HttpStatus } from '@basketcol/domain';

import { ExpressBaseController } from '../../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { ICreateLeagueTeamUseCase } from '../../../../application/use-cases/ports/ICreateLeagueTeamUseCase';
import { CreateLeagueTeamDTO } from '../../../../application/dtos/CreateLeagueTeamDTO';

type Dependencies = {
  readonly createLeagueTeamUseCase: ICreateLeagueTeamUseCase;
};

export class ExpressCreateLeagueTeamPOSTController implements ExpressBaseController {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): ExpressCreateLeagueTeamPOSTController {
    return new ExpressCreateLeagueTeamPOSTController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const createLeagueTeamDTO: CreateLeagueTeamDTO = request.body;

    await this.dependencies.createLeagueTeamUseCase.execute(createLeagueTeamDTO, request.userContext);
    response.status(HttpStatus.CREATED).send();
  }
}
