import { DateValueObject, HttpStatus } from '@basketcol/domain';
import { Request, Response } from 'express';
import multer from 'multer';

import { CreateHostUserDTO } from '../../../../application/dtos/CreateHostUserDTO';
import { ICreateHostUserUseCase } from '../../../../application/use-cases/ports/ICreateHostUserUseCase';
import { ExpressBaseController } from '../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { ImageFile, IProfileImageUploader } from '../../../../../shared/application/ports/IProfileImageUploader';
import { MulterError } from '../../../../../../shared/infrastructure/exceptions/MulterError';

type Dependencies = {
  createHostUserUseCase: ICreateHostUserUseCase;
  profileImageUploader: IProfileImageUploader;
};

export class ExpressCreateHostUserPOSTController implements ExpressBaseController {
  readonly #createHostUserUseCase: ICreateHostUserUseCase;

  readonly #imageUploadMiddleware: multer.Multer;

  readonly #profileImageUploader: IProfileImageUploader;

  private constructor(dependencies: Dependencies) {
    this.#createHostUserUseCase = dependencies.createHostUserUseCase;
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

  public static create(dependencies: Dependencies): ExpressCreateHostUserPOSTController {
    return new ExpressCreateHostUserPOSTController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const createHostUserDTO: CreateHostUserDTO = request.body;

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
      createHostUserDTO.profileImage = { url: profileImage.url, updatedAt: formattedDate };
    }

    await this.#createHostUserUseCase.execute(createHostUserDTO);

    response.status(HttpStatus.CREATED).send();
  }

  public getImageUploadMiddleware() {
    return this.#imageUploadMiddleware.single('profileImage');
  }
}
