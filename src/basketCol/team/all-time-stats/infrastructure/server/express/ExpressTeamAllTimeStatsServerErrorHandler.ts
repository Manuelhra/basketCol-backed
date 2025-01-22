import { HttpStatus } from '@basketcol/domain';
import { Response } from 'express';

import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';
import { IServerErrorHandler } from '../../../../../shared/infrastructure/server/IServerErrorHandler';
import { TeamAllTimeStatsNotFoundError } from '../../../application/exceptions/TeamAllTimeStatsNotFoundError';
import { IErrorApiResponse } from '../../../../../shared/application/http/ports/IErrorApiResponse';

type Dependencies = {
  readonly httpResponseHandler: IHttpResponseHandler;
};

export class ExpressTeamAllTimeStatsServerErrorHandler implements IServerErrorHandler {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): ExpressTeamAllTimeStatsServerErrorHandler {
    return new ExpressTeamAllTimeStatsServerErrorHandler(dependencies);
  }

  public run(response: Response, error: Error): void {
    let errorResponse: IErrorApiResponse | null = null;
    let status: number | null = null;
    let isInstanceof: boolean = false;

    switch (true) {
      case error instanceof TeamAllTimeStatsNotFoundError:
        errorResponse = this.dependencies.httpResponseHandler.handleSingleErrorResponse({
          code: HttpStatus.NOT_FOUND,
          message: HttpStatus.getMessage(HttpStatus.NOT_FOUND),
          error: { name: error.name, details: error.message },
        });
        status = HttpStatus.NOT_FOUND;
        isInstanceof = true;
        break;
    }

    if (isInstanceof && status !== null && errorResponse !== null) {
      response.status(status).json(errorResponse);
    }
  }
}
