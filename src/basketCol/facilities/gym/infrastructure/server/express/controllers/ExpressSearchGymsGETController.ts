import { Request, Response } from 'express';
import { HttpStatus } from '@basketcol/domain';

import { ExpressBaseController } from '../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { ISearchGymsUseCase } from '../../../../application/use-cases/ports/ISearchGymsUseCase';
import { IHttpResponseHandler } from '../../../../../../shared/application/http/ports/IHttpResponseHandler';

type Dependencies = {
  readonly searchGymsUseCase: ISearchGymsUseCase;
  readonly httpResponseHandler: IHttpResponseHandler;
};

export class ExpressSearchGymsGETController implements ExpressBaseController {
  readonly #searchGymsUseCase: ISearchGymsUseCase;

  readonly #httpResponseHandler: IHttpResponseHandler;

  private constructor(dependencies: Dependencies) {
    this.#searchGymsUseCase = dependencies.searchGymsUseCase;
    this.#httpResponseHandler = dependencies.httpResponseHandler;
  }

  public static create(dependencies: Dependencies): ExpressSearchGymsGETController {
    return new ExpressSearchGymsGETController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const { query, page, perPage } = request.query;

    const dto = {
      query: this.#parseQuery(query),
      page: this.#parseNumber(page, 1),
      perPage: this.#parseNumber(perPage, 10),
    };

    const { data, pagination } = await this.#searchGymsUseCase.execute(dto);

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
