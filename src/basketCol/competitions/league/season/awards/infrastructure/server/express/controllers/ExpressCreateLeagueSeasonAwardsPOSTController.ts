import { Request, Response } from 'express';
import { HttpStatus } from '@basketcol/domain';

import { ExpressBaseController } from '../../../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { ICreateLeagueSeasonAwardsUseCase } from '../../../../application/use-cases/ports/ICreateLeagueSeasonAwardsUseCase';
import { CreateLeagueSeasonAwardsDTO } from '../../../../application/dtos/CreateLeagueSeasonAwardsDTO';

type Dependencies = {
  readonly createLeagueSeasonAwardsUseCase: ICreateLeagueSeasonAwardsUseCase;
};

export class ExpressCreateLeagueSeasonAwardsPOSTController implements ExpressBaseController {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): ExpressCreateLeagueSeasonAwardsPOSTController {
    return new ExpressCreateLeagueSeasonAwardsPOSTController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const createLeagueSeasonAwardsDTO: CreateLeagueSeasonAwardsDTO = request.body;

    await this.dependencies.createLeagueSeasonAwardsUseCase.execute(createLeagueSeasonAwardsDTO, request.userContext);
    response.status(HttpStatus.CREATED).send();
  }
}
