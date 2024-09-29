import { HttpStatus } from '@basketcol/domain';
import { Request, Response } from 'express';

import { ExpressBaseController } from '../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { CreatePlayerUserDTO } from '../../../../application/dtos/CreatePlayerUserDTO';
import { ICreatePlayerUserUseCase } from '../../../../application/use-cases/ports/ICreatePlayerUserUseCase';

type Dependencies = {
  createPlayerUserUseCase: ICreatePlayerUserUseCase;
};

export class ExpressCreatePlayerUserPOSTController implements ExpressBaseController {
  readonly #createPlayerUserUseCase: ICreatePlayerUserUseCase;

  private constructor(dependencies: Dependencies) {
    this.#createPlayerUserUseCase = dependencies.createPlayerUserUseCase;
  }

  public static create(dependencies: Dependencies): ExpressCreatePlayerUserPOSTController {
    return new ExpressCreatePlayerUserPOSTController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const createPlayerUserDTO: CreatePlayerUserDTO = request.body;

    await this.#createPlayerUserUseCase.execute(createPlayerUserDTO, request.userContext);

    response.status(HttpStatus.CREATED).send();
  }
}
