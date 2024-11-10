import { Request, RequestHandler, Response } from 'express';
import multer from 'multer';
import { DateValueObject, HttpStatus } from '@basketcol/domain';

import { ExpressBaseController } from '../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { ICreateRefereeUserUseCase } from '../../../../application/use-cases/ports/ICreateRefereeUserUseCase';
import { IProfileImageUploader } from '../../../../../shared/application/file-upload/images/ports/IProfileImageUploader';
import { MulterError } from '../../../../../../shared/infrastructure/exceptions/MulterError';
import { CreateRefereeUserDTO } from '../../../../application/dtos/CreateRefereeUserDTO';
import { ImageFile } from '../../../../../../shared/application/file-upload/images/ports/IImageUploader';

type Dependencies = {
  readonly createRefereeUserUseCase: ICreateRefereeUserUseCase;
  readonly profileImageUploader: IProfileImageUploader;
};

export class ExpressCreateRefereeUserPOSTController
implements ExpressBaseController {
  readonly #createRefereeUserUseCase: ICreateRefereeUserUseCase;

  readonly #imageUploadMiddleware: multer.Multer;

  readonly #profileImageUploader: IProfileImageUploader;

  private constructor(dependencies: Dependencies) {
    this.#createRefereeUserUseCase = dependencies.createRefereeUserUseCase;
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

  public static create(dependencies: Dependencies): ExpressCreateRefereeUserPOSTController {
    return new ExpressCreateRefereeUserPOSTController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const createRefereeUserDTO: CreateRefereeUserDTO = request.body;

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
      createRefereeUserDTO.profileImage = {
        url: profileImage.url,
        uploadedAt: formattedDate,
        alt: imageFile.originalName,
        dimensions: {
          width: profileImage.metadata.width,
          height: profileImage.metadata.height,
        },
      };
    }

    await this.#createRefereeUserUseCase.execute(createRefereeUserDTO, request.userContext);
    response.status(HttpStatus.CREATED).send();
  }

  public getImageUploadMiddleware(): RequestHandler {
    return this.#imageUploadMiddleware.single('profileImage');
  }
}
