import { Request, Response } from 'express';
import { HttpStatus, Nullable, PlayerUser } from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { ExpressBaseController } from '../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { IFindPlayerUserByIdUseCase } from '../../../../application/use-cases/ports/IFindPlayerUserByIdUseCase';

type Dependencies = {
  readonly findPlayerUserByIdUseCase: IFindPlayerUserByIdUseCase;
  httpResponseHandler: IHttpResponseHandler;
};

export class ExpressFindPlayerUserByIdGETController implements ExpressBaseController {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): ExpressFindPlayerUserByIdGETController {
    return new ExpressFindPlayerUserByIdGETController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const { playerUserId } = request.params;
    const playerUser: Nullable<PlayerUser> = await this.dependencies.findPlayerUserByIdUseCase.execute({ id: playerUserId });

    const successResult = this.dependencies.httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.OK,
      message: HttpStatus.getMessage(HttpStatus.OK),
      data: {
        playerUser: playerUser ? playerUser.toPrimitives : null,
      },
    });

    response.status(HttpStatus.OK).json(successResult);
  }
}
