import { Request, Response } from 'express';
import { HttpStatus } from '@basketcol/domain';

import { ExpressBaseController } from '../../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { ICreateLeagueSeasonUseCase } from '../../../../application/use-cases/ports/ICreateLeagueSeasonUseCase';
import { CreateLeagueSeasonDTO } from '../../../../application/dtos/CreateLeagueSeasonDTO';

type Dependencies = {
  readonly createLeagueSeasonUseCase: ICreateLeagueSeasonUseCase
};

export class ExpressCreateLeagueSeasonPOSTController implements ExpressBaseController {
  readonly #createLeagueSeasonUseCase: ICreateLeagueSeasonUseCase;

  private constructor(dependencies: Dependencies) {
    this.#createLeagueSeasonUseCase = dependencies.createLeagueSeasonUseCase;
  }

  public static create(dependencies: Dependencies): ExpressCreateLeagueSeasonPOSTController {
    return new ExpressCreateLeagueSeasonPOSTController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const createLeagueSeasonDTO: CreateLeagueSeasonDTO = request.body;

    await this.#createLeagueSeasonUseCase.execute(createLeagueSeasonDTO);
    response.status(HttpStatus.CREATED).send();
  }
}
