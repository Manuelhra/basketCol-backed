import { Request, Response } from 'express';
import { HttpStatus } from '@basketcol/domain';

import { ExpressBaseController } from '../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { ISearchAllLeaguesUseCase } from '../../../../application/use-cases/ports/ISearchAllLeaguesUseCase';
import { IHttpResponseHandler } from '../../../../../../shared/application/http/ports/IHttpResponseHandler';

type Dependencies = {
  readonly searchAllLeaguesUseCase: ISearchAllLeaguesUseCase;
  readonly httpResponseHandler: IHttpResponseHandler;
};

export class ExpressSearchAllLeaguesGETController implements ExpressBaseController {
  readonly #searchAllLeaguesUseCase: ISearchAllLeaguesUseCase;

  readonly #httpResponseHandler: IHttpResponseHandler;

  private constructor(dependencies: Dependencies) {
    this.#searchAllLeaguesUseCase = dependencies.searchAllLeaguesUseCase;
    this.#httpResponseHandler = dependencies.httpResponseHandler;
  }

  public static create(dependencies: Dependencies): ExpressSearchAllLeaguesGETController {
    return new ExpressSearchAllLeaguesGETController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const { query, page, perPage } = request.query;

    const dto = {
      query: this.#parseQuery(query),
      page: this.#parseNumber(page, 1),
      perPage: this.#parseNumber(perPage, 10),
    };

    const { data, pagination } = await this.#searchAllLeaguesUseCase.execute(dto);

    const successResult = this.#httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.OK,
      message: HttpStatus.getMessage(HttpStatus.OK),
      data: {
        leagues: data.map((league) => league.toPrimitives),
      },
      paginationParams: pagination,
    });

    response.status(HttpStatus.OK).json(successResult);
  }

  #parseQuery(query: unknown): string {
    return query !== undefined && query !== null ? String(query) : '';
  }

  #parseNumber(value: unknown, defaultValue: number): number {
    return value !== undefined && value !== null ? Number(value) : defaultValue;
  }
}
