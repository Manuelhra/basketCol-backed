import { HttpStatus } from '@basketcol/domain';
import { Request, Response } from 'express';

import { CreateHostUserUseCase } from '../../../../application/use-cases/CreateHostUserUseCase';
import { CreateHostUserDTO } from '../../../../application/dtos/CreateHostUserDTO';
import { IController } from '../../../../../../shared/infrastructure/server/controllers/IController';

export class ExpressHostUserPostController implements IController<Request, Response> {
  readonly #createHostUserUseCase: CreateHostUserUseCase;

  public constructor(dependencies: {
    createHostUserUseCase: CreateHostUserUseCase;
  }) {
    this.#createHostUserUseCase = dependencies.createHostUserUseCase;
  }

  public async run(request: Request, response: Response): Promise<void> {
    const createHostUserDTO: CreateHostUserDTO = request.body;

    await this.#createHostUserUseCase.execute(createHostUserDTO);

    response.status(HttpStatus.CREATED).send();
  }
}
