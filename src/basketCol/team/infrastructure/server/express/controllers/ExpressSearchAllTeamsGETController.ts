import { Request, Response } from 'express';
import { HttpStatus } from '@basketcol/domain';

import { ExpressBaseController } from '../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { ISearchAllTeamsUseCase } from '../../../../application/use-cases/ports/ISearchAllTeamsUseCase';
import { IHttpResponseHandler } from '../../../../../shared/application/http/ports/IHttpResponseHandler';

type Dependencies = {
  readonly searchAllTeamsUseCase: ISearchAllTeamsUseCase;
  readonly httpResponseHandler: IHttpResponseHandler;
};

export class ExpressSearchAllTeamsGETController implements ExpressBaseController {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): ExpressSearchAllTeamsGETController {
    return new ExpressSearchAllTeamsGETController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const { query, page, perPage } = request.query;

    const dto = {
      query: this.#parseQuery(query),
      page: this.#parseNumber(page, 1),
      perPage: this.#parseNumber(perPage, 10),
    };

    const { data, pagination } = await this.dependencies.searchAllTeamsUseCase.execute(dto);

    const successResult = this.dependencies.httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.OK,
      message: HttpStatus.getMessage(HttpStatus.OK),
      data: {
        teams: data.map((team) => team.toPrimitives),
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
