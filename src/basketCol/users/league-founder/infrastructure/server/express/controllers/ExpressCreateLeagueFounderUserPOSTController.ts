import { Request, Response } from 'express';
import multer from 'multer';
import { DateValueObject, HttpStatus } from '@basketcol/domain';

import { ExpressBaseController } from '../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { ICreateLeagueFounderUserUseCase } from '../../../../application/use-cases/ports/ICreateLeagueFounderUserUseCase';
import { CreateLeagueFounderUserDTO } from '../../../../application/dtos/CreateLeagueFounderUserDTO';
import { ImageFile } from '../../../../../../shared/application/file-upload/images/ports/IImageUploader';
import { IProfileImageUploader } from '../../../../../shared/application/file-upload/images/ports/IProfileImageUploader';
import { MulterError } from '../../../../../../shared/infrastructure/exceptions/MulterError';

type Dependencies = {
  readonly createLeagueFounderUserUseCase: ICreateLeagueFounderUserUseCase;
  readonly profileImageUploader: IProfileImageUploader;
};

export class ExpressCreateLeagueFounderUserPOSTController implements ExpressBaseController {
  readonly #createLeagueFounderUserUseCase: ICreateLeagueFounderUserUseCase;

  readonly #imageUploadMiddleware: multer.Multer;

  readonly #profileImageUploader: IProfileImageUploader;

  private constructor(dependencies: Dependencies) {
    this.#createLeagueFounderUserUseCase = dependencies.createLeagueFounderUserUseCase;
    this.#profileImageUploader = dependencies.profileImageUploader;
    this.#imageUploadMiddleware = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (_, file, callback) => {
        const isImageFile: boolean = file.mimetype.startsWith('image/');

        if (isImageFile === false) {
          throw MulterError.create('LIMIT_UNEXPECTED_FILE', 'Only image files are allowed');
        }

        callback(null, true);
      },
    });
  }

  public static create(dependencies: Dependencies): ExpressCreateLeagueFounderUserPOSTController {
    return new ExpressCreateLeagueFounderUserPOSTController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const createLeagueFounderUserDTO: CreateLeagueFounderUserDTO = request.body;

    if (request.file !== undefined) {
      const imageFile: ImageFile = {
        buffer: request.file.buffer,
        metadata: {
          mimetype: request.file.mimetype,
          encoding: request.file.encoding,
          filename: request.file.originalname,
          size: request.file.size,
        },
        originalName: request.file.originalname,
      };

      const profileImage = await this.#profileImageUploader.uploadProfileImage(imageFile);
      const formattedDate = DateValueObject.getCurrentDate().dateAsString;

      createLeagueFounderUserDTO.profileImage = {
        url: profileImage.url,
        uploadedAt: formattedDate,
        alt: imageFile.originalName,
        dimensions: {
          width: profileImage.metadata.width,
          height: profileImage.metadata.height,
        },
      };
    }

    await this.#createLeagueFounderUserUseCase.execute(createLeagueFounderUserDTO, request.userContext);
    response.status(HttpStatus.CREATED).send();
  }

  public getImageUploadMiddleware() {
    return this.#imageUploadMiddleware.single('profileImage');
  }
}
