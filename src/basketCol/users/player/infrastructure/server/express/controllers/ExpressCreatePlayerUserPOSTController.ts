import { HttpStatus } from '@basketcol/domain';
import { Request, Response } from 'express';

import { ExpressBaseController } from '../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { CreatePlayerUserDTO } from '../../../../application/dtos/CreatePlayerUserDTO';
import { ICreatePlayerUserUseCase } from '../../../../application/use-cases/ports/ICreatePlayerUserUseCase';

export class ExpressCreatePlayerUserPOSTController implements ExpressBaseController {
  readonly #createPlayerUserUseCase: ICreatePlayerUserUseCase;

  public constructor(dependencies: {
    createPlayerUserUseCase: ICreatePlayerUserUseCase;
  }) {
    this.#createPlayerUserUseCase = dependencies.createPlayerUserUseCase;
  }

  public async run(request: Request, response: Response): Promise<void> {
    const createPlayerUserDTO: CreatePlayerUserDTO = request.body;

    await this.#createPlayerUserUseCase.execute(createPlayerUserDTO, request.userContext);

    response.status(HttpStatus.CREATED).send();
  }
}
