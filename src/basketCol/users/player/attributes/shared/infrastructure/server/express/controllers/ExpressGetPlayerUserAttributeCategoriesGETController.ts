import { HttpStatus } from '@basketcol/domain';
import { Request, Response } from 'express';

import { ExpressBaseController } from '../../../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { GetPlayerUserAttributeCategoriesUseCase } from '../../../../application/use-cases/GetPlayerUserAttributeCategoriesUseCase';
import { IHttpResponseHandler } from '../../../../../../../../shared/application/http/ports/IHttpResponseHandler';

type Dependencies = {
  readonly getPlayerUserAttributeCategoriesUseCase: GetPlayerUserAttributeCategoriesUseCase;
  readonly httpResponseHandler: IHttpResponseHandler;
};

type AttributeCategory = {
  toPrimitives: unknown;
};

export class ExpressGetPlayerUserAttributeCategoriesGETController implements ExpressBaseController {
  readonly #getPlayerUserAttributeCategoriesUseCase: GetPlayerUserAttributeCategoriesUseCase;

  readonly #httpResponseHandler: IHttpResponseHandler;

  private constructor(dependencies: Dependencies) {
    this.#getPlayerUserAttributeCategoriesUseCase = dependencies.getPlayerUserAttributeCategoriesUseCase;
    this.#httpResponseHandler = dependencies.httpResponseHandler;
  }

  public static create(dependencies: Dependencies): ExpressGetPlayerUserAttributeCategoriesGETController {
    return new ExpressGetPlayerUserAttributeCategoriesGETController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const { playerUserId } = request.params;
    const result = await this.#getPlayerUserAttributeCategoriesUseCase.execute({ playerUserId });

    const successResult = this.#httpResponseHandler.handleSuccessResponse({
      code: HttpStatus.OK,
      message: HttpStatus.getMessage(HttpStatus.OK),
      data: {
        attributeCategories: this.#transformAttributes(result),
      },
    });

    response.status(HttpStatus.OK).json(successResult);
  }

  #transformAttributes(result: Record<string, AttributeCategory | null | undefined>) {
    const attributeKeys = [
      'defensiveAttributes',
      'finishingAttributes',
      'physicalAttributes',
      'reboundingAttributes',
      'shootingAttributes',
      'skillAttributes',
    ] as const;

    const transformedAttributes = {} as Record<string, unknown>;

    attributeKeys.forEach((key) => {
      transformedAttributes[key] = this.#validateAndTransformAttribute(result[key]);
    });

    return transformedAttributes;
  }

  #validateAndTransformAttribute(attribute: AttributeCategory | null | undefined): unknown {
    if (!this.#isValidAttribute(attribute)) {
      return null;
    }

    return attribute.toPrimitives;
  }

  #isValidAttribute(attribute: AttributeCategory | null | undefined): attribute is AttributeCategory {
    return attribute !== null
           && attribute !== undefined
           && typeof attribute === 'object'
           && 'toPrimitives' in attribute;
  }
}
