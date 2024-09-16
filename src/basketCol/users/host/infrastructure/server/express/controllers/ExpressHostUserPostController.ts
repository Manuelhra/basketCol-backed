import { HttpStatus } from '@basketcol/domain';
import { Request, Response } from 'express';

import { CreateHostUserDTO } from '../../../../application/dtos/CreateHostUserDTO';
import { ICreateHostUserUseCase } from '../../../../application/use-cases/ports/ICreateHostUserUseCase';
import { ExpressBaseController } from '../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';

export class ExpressHostUserPOSTController implements ExpressBaseController {
  readonly #createHostUserUseCase: ICreateHostUserUseCase;

  public constructor(dependencies: {
    createHostUserUseCase: ICreateHostUserUseCase;
  }) {
    this.#createHostUserUseCase = dependencies.createHostUserUseCase;
  }

  public async run(request: Request, response: Response): Promise<void> {
    const createHostUserDTO: CreateHostUserDTO = request.body;

    await this.#createHostUserUseCase.execute(createHostUserDTO);

    response.status(HttpStatus.CREATED).send();
  }
}
