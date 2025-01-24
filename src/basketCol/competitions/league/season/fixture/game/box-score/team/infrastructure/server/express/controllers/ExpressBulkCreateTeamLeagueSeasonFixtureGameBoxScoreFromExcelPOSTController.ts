import multer from 'multer';
import { WorkBook } from 'xlsx';
import { Request, RequestHandler, Response } from 'express';
import { HttpStatus } from '@basketcol/domain';

import { IHttpResponseHandler } from '../../../../../../../../../../../shared/application/http/ports/IHttpResponseHandler';
import { IExcelManager } from '../../../../../../../../../../../shared/infrastructure/file-upload/excel/ports/IExcelManager';
import { ExpressBaseController } from '../../../../../../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { MulterError } from '../../../../../../../../../../../shared/infrastructure/exceptions/MulterError';
import { BulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelService } from '../services/BulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelService';

type Dependencies = {
  readonly httpResponseHandler: IHttpResponseHandler;
  readonly excelManager: IExcelManager;
  readonly bulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelService: BulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelService;
};

export class ExpressBulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController
implements ExpressBaseController {
  readonly #excelFileUploadMiddleware: multer.Multer;

  private constructor(private readonly dependencies: Dependencies) {
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

  public static create(dependencies: Dependencies): ExpressBulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController {
    return new ExpressBulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    if (request.file === undefined) {
      const errorResponse = this.dependencies.httpResponseHandler.handleSingleErrorResponse({
        code: HttpStatus.BAD_REQUEST,
        message: 'No file found to upload data',
        error: { name: 'NoFileError', details: 'No file found to upload league season fixture games' },
      });

      response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
      return;
    }

    if (request.userContext === undefined) {
      const errorResponse = this.dependencies.httpResponseHandler.handleSingleErrorResponse({
        code: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized request',
        error: { name: 'UnauthorizedError', details: 'No user context found in request' },
      });

      response.status(HttpStatus.UNAUTHORIZED).json(errorResponse);
      return;
    }

    const workBook: WorkBook = await this.dependencies.excelManager.readExcelFileFromBuffer(request.file.buffer);
    await this.dependencies.bulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelService.execute(workBook, request.userContext);
    response.status(HttpStatus.CREATED).send();
  }

  public getExcelFileUploadMiddleware(): RequestHandler {
    return this.#excelFileUploadMiddleware.single('game-box-score');
  }
}
