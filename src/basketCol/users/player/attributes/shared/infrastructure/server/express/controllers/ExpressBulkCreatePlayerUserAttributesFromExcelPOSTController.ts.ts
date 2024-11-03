import { HttpStatus } from '@basketcol/domain';
import { Request, RequestHandler, Response } from 'express';
import multer from 'multer';
import { WorkBook } from 'xlsx';

import { ExpressBaseController } from '../../../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { MulterError } from '../../../../../../../../shared/infrastructure/exceptions/MulterError';
import { IHttpResponseHandler } from '../../../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { IExcelManager } from '../../../../../../../../shared/infrastructure/excel/ports/IExcelManager';
import { BulkCreatePlayerAttributesService } from '../../../services/BulkCreatePlayerAttributesService';

type Dependencies = {
  readonly httpResponseHandler: IHttpResponseHandler;
  readonly excelManager: IExcelManager;
  readonly bulkCreatePlayerAttributesService: BulkCreatePlayerAttributesService;
};

export class ExpressBulkCreatePlayerUserAttributesFromExcelPOSTController implements ExpressBaseController {
  readonly #excelFileUploadMiddleware: multer.Multer;

  readonly #httpResponseHandler: IHttpResponseHandler;

  readonly #excelManager: IExcelManager;

  readonly #bulkCreatePlayerAttributesService: BulkCreatePlayerAttributesService;

  private constructor(dependencies: Dependencies) {
    this.#httpResponseHandler = dependencies.httpResponseHandler;
    this.#excelManager = dependencies.excelManager;
    this.#bulkCreatePlayerAttributesService = dependencies.bulkCreatePlayerAttributesService;
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

  public static create(dependencies: Dependencies): ExpressBulkCreatePlayerUserAttributesFromExcelPOSTController {
    return new ExpressBulkCreatePlayerUserAttributesFromExcelPOSTController(dependencies);
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

    const workBook: WorkBook = await this.#excelManager.readExcelFileFromBuffer(request.file.buffer);
    await this.#bulkCreatePlayerAttributesService.execute(workBook);

    response.status(HttpStatus.OK).send();
  }

  public getExcelFileUploadMiddleware(): RequestHandler {
    return this.#excelFileUploadMiddleware.single('playerAttributes');
  }
}
