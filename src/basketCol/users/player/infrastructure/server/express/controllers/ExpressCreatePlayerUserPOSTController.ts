import { DateValueObject, HttpStatus } from '@basketcol/domain';
import { Request, Response } from 'express';
import multer from 'multer';

import { ExpressBaseController } from '../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { CreatePlayerUserDTO } from '../../../../application/dtos/CreatePlayerUserDTO';
import { ICreatePlayerUserUseCase } from '../../../../application/use-cases/ports/ICreatePlayerUserUseCase';
import { ImageFile, IProfileImageUploader } from '../../../../../shared/application/ports/IProfileImageUploader';
import { MulterError } from '../../../../../../shared/infrastructure/exceptions/MulterError';

type Dependencies = {
  createPlayerUserUseCase: ICreatePlayerUserUseCase;
  profileImageUploader: IProfileImageUploader;
};

export class ExpressCreatePlayerUserPOSTController implements ExpressBaseController {
  readonly #createPlayerUserUseCase: ICreatePlayerUserUseCase;

  readonly #imageUploadMiddleware: multer.Multer;

  readonly #profileImageUploader: IProfileImageUploader;

  private constructor(dependencies: Dependencies) {
    this.#createPlayerUserUseCase = dependencies.createPlayerUserUseCase;
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

  public static create(dependencies: Dependencies): ExpressCreatePlayerUserPOSTController {
    return new ExpressCreatePlayerUserPOSTController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const createPlayerUserDTO: CreatePlayerUserDTO = request.body;

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
      createPlayerUserDTO.profileImage = { url: profileImage.url, updatedAt: formattedDate };
    }

    await this.#createPlayerUserUseCase.execute(createPlayerUserDTO, request.userContext);

    response.status(HttpStatus.CREATED).send();
  }

  public getImageUploadMiddleware() {
    return this.#imageUploadMiddleware.single('profileImage');
  }
}
