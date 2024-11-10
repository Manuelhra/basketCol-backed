import { Request, RequestHandler, Response } from 'express';
import multer from 'multer';
import { DateValueObject, HttpStatus } from '@basketcol/domain';

import { ExpressBaseController } from '../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { ICreateTeamFounderUserUseCase } from '../../../../application/use-cases/ports/ICreateTeamFounderUserUseCase';
import { IProfileImageUploader } from '../../../../../shared/application/file-upload/images/ports/IProfileImageUploader';
import { MulterError } from '../../../../../../shared/infrastructure/exceptions/MulterError';
import { CreateTeamFounderUserDTO } from '../../../../application/dtos/CreateTeamFounderUserDTO';
import { ImageFile } from '../../../../../../shared/application/file-upload/images/ports/IImageUploader';

type Dependencies = {
  readonly createTeamFounderUserUseCase: ICreateTeamFounderUserUseCase;
  readonly profileImageUploader: IProfileImageUploader;
};

export class ExpressCreateTeamFounderUserPOSTController
implements ExpressBaseController {
  readonly #createTeamFounderUserUseCase: ICreateTeamFounderUserUseCase;

  readonly #imageUploadMiddleware: multer.Multer;

  readonly #profileImageUploader: IProfileImageUploader;

  private constructor(dependencies: Dependencies) {
    this.#createTeamFounderUserUseCase = dependencies.createTeamFounderUserUseCase;
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

  public static create(dependencies: Dependencies): ExpressCreateTeamFounderUserPOSTController {
    return new ExpressCreateTeamFounderUserPOSTController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const createTeamFounderUserDTO: CreateTeamFounderUserDTO = request.body;

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
      createTeamFounderUserDTO.profileImage = {
        url: profileImage.url,
        uploadedAt: formattedDate,
        alt: imageFile.originalName,
        dimensions: {
          width: profileImage.metadata.width,
          height: profileImage.metadata.height,
        },
      };
    }

    await this.#createTeamFounderUserUseCase.execute(createTeamFounderUserDTO, request.userContext);
    response.status(HttpStatus.CREATED).send();
  }

  public getImageUploadMiddleware(): RequestHandler {
    return this.#imageUploadMiddleware.single('profileImage');
  }
}
