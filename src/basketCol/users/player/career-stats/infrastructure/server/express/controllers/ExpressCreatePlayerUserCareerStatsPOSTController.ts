import { HttpStatus } from '@basketcol/domain';
import { Request, Response } from 'express';

import { ExpressBaseController } from '../../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { ICreatePlayerUserCareerStatsUseCase } from '../../../../application/use-cases/ports/ICreatePlayerUserCareerStatsUseCase';
import { CreatePlayerUserCareerStatsDTO } from '../../../../application/dtos/CreatePlayerUserCareerStatsDTO';

type Dependencies = {
  readonly createPlayerUserCareerStatsUseCase: ICreatePlayerUserCareerStatsUseCase;
};

export class ExpressCreatePlayerUserCareerStatsPOSTController implements ExpressBaseController {
  readonly #createPlayerUserCareerStatsUseCase: ICreatePlayerUserCareerStatsUseCase;

  private constructor(dependencies: Dependencies) {
    this.#createPlayerUserCareerStatsUseCase = dependencies.createPlayerUserCareerStatsUseCase;
  }

  public static create(dependencies: Dependencies): ExpressCreatePlayerUserCareerStatsPOSTController {
    return new ExpressCreatePlayerUserCareerStatsPOSTController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const createPlayerUserCareerStatsDTO: CreatePlayerUserCareerStatsDTO = request.body;
    const { playerUserId } = request.params;

    createPlayerUserCareerStatsDTO.playerUserId = playerUserId;
    await this.#createPlayerUserCareerStatsUseCase.execute(createPlayerUserCareerStatsDTO);

    response.status(HttpStatus.CREATED).send();
  }
}
