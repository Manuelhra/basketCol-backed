import { Request, Response } from 'express';
import { HttpStatus } from '@basketcol/domain';

import { ExpressBaseController } from '../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { ISearchAllGymsUseCase } from '../../../../application/use-cases/ports/ISearchAllGymsUseCase';
import { IHttpResponseHandler } from '../../../../../../shared/application/http/ports/IHttpResponseHandler';

type Dependencies = {
  readonly searchAllGymsUseCase: ISearchAllGymsUseCase;
  readonly httpResponseHandler: IHttpResponseHandler;
};

export class ExpressSearchAllGymsGETController implements ExpressBaseController {
  readonly #searchAllGymsUseCase: ISearchAllGymsUseCase;

  readonly #httpResponseHandler: IHttpResponseHandler;

  private constructor(dependencies: Dependencies) {
    this.#searchAllGymsUseCase = dependencies.searchAllGymsUseCase;
    this.#httpResponseHandler = dependencies.httpResponseHandler;
  }

  public static create(dependencies: Dependencies): ExpressSearchAllGymsGETController {
    return new ExpressSearchAllGymsGETController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const { query, page, perPage } = request.query;

    const dto = {
      query: this.#parseQuery(query),
      page: this.#parseNumber(page, 1),
      perPage: this.#parseNumber(perPage, 10),
    };

    const { data, pagination } = await this.#searchAllGymsUseCase.execute(dto);

    const successResult = this.#httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.OK,
      message: HttpStatus.getMessage(HttpStatus.OK),
      data: {
        gyms: data.map((gym) => gym.toPrimitives),
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
