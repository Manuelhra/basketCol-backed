import { Request, Response } from 'express';
import { HttpStatus } from '@basketcol/domain';

import { ExpressBaseController } from '../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { CreateLeagueDTO } from '../../../../application/dtos/CreateLeagueDTO';
import { ICreateLeagueUseCase } from '../../../../application/use-cases/ports/ICreateLeagueUseCase';

type Dependencies = {
  readonly createLeagueUseCase: ICreateLeagueUseCase;
};

export class ExpressCreateLeaguePOSTController implements ExpressBaseController {
  readonly #createLeagueUseCase: ICreateLeagueUseCase;

  private constructor(dependencies: Dependencies) {
    this.#createLeagueUseCase = dependencies.createLeagueUseCase;
  }

  public static create(dependencies: Dependencies): ExpressCreateLeaguePOSTController {
    return new ExpressCreateLeaguePOSTController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const createLeagueDTO: CreateLeagueDTO = request.body;

    await this.#createLeagueUseCase.execute(createLeagueDTO, request.userContext);
    response.status(HttpStatus.CREATED).send();
  }
}
