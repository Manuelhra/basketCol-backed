import { HttpStatus } from '@basketcol/domain';
import { Request, RequestHandler, Response } from 'express';
import multer from 'multer';
import { WorkBook } from 'xlsx';

import { ExpressBaseController } from '../../../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { MulterError } from '../../../../../../../../shared/infrastructure/exceptions/MulterError';
import { IHttpResponseHandler } from '../../../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { IExcelManager } from '../../../../../../../../shared/infrastructure/excel/ports/IExcelManager';
import { BulkCreatePlayerUserAttributeCategoriesService } from '../../../services/BulkCreatePlayerUserAttributeCategoriesService';

type Dependencies = {
  readonly httpResponseHandler: IHttpResponseHandler;
  readonly excelManager: IExcelManager;
  readonly bulkCreatePlayerUserAttributeCategoriesService: BulkCreatePlayerUserAttributeCategoriesService;
};

export class ExpressBulkCreatePlayerUserAttributeCategoriesFromExcelPOSTController implements ExpressBaseController {
  readonly #excelFileUploadMiddleware: multer.Multer;

  readonly #httpResponseHandler: IHttpResponseHandler;

  readonly #excelManager: IExcelManager;

  readonly #bulkCreatePlayerUserAttributeCategoriesService: BulkCreatePlayerUserAttributeCategoriesService;

  private constructor(dependencies: Dependencies) {
    this.#httpResponseHandler = dependencies.httpResponseHandler;
    this.#excelManager = dependencies.excelManager;
    this.#bulkCreatePlayerUserAttributeCategoriesService = dependencies.bulkCreatePlayerUserAttributeCategoriesService;
    this.#excelFileUploadMiddleware = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (_, file, callback) => {
        const isExcelFile: boolean = file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        if (isExcelFile === false) {
          throw MulterError.create('LIMIT_UNEXPECTED_FILE', 'Only Excel files are allowed');
        }

        callback(null, true);
      },
    });
  }

  public static create(dependencies: Dependencies): ExpressBulkCreatePlayerUserAttributeCategoriesFromExcelPOSTController {
    return new ExpressBulkCreatePlayerUserAttributeCategoriesFromExcelPOSTController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    if (request.file === undefined) {
      const errorResponse = this.#httpResponseHandler.handleSingleErrorResponse({
        code: HttpStatus.BAD_REQUEST,
        message: 'No file found to upload data',
        error: { name: 'NoFileError', details: 'No file found to upload player attributes' },
      });

      response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
      return;
    }

    if (request.userContext === undefined) {
      const errorResponse = this.#httpResponseHandler.handleSingleErrorResponse({
        code: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized request',
        error: { name: 'UnauthorizedError', details: 'No user context found in request' },
      });

      response.status(HttpStatus.UNAUTHORIZED).json(errorResponse);
      return;
    }

    const workBook: WorkBook = await this.#excelManager.readExcelFileFromBuffer(request.file.buffer);
    await this.#bulkCreatePlayerUserAttributeCategoriesService.execute(workBook, request.userContext);

    response.status(HttpStatus.OK).send();
  }

  public getExcelFileUploadMiddleware(): RequestHandler {
    return this.#excelFileUploadMiddleware.single('playerAttributes');
  }
}
