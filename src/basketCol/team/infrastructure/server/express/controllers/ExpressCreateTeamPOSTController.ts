import { Request, RequestHandler, Response } from 'express';
import multer from 'multer';
import { DateValueObject, HttpStatus } from '@basketcol/domain';

import { ImageFile } from '../../../../../shared/application/file-upload/images/ports/IImageUploader';
import { ExpressBaseController } from '../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { CreateTeamDTO } from '../../../../application/dtos/CreateTeamDTO';
import { ICreateTeamUseCase } from '../../../../application/use-cases/ports/ICreateTeamUseCase';
import { MulterError } from '../../../../../shared/infrastructure/exceptions/MulterError';
import { IBatchGalleryImagesUploader } from '../../../../../shared/application/file-upload/images/ports/IBatchGalleryImagesUploader';
import { IMainImageUploader } from '../../../../../shared/application/file-upload/images/ports/IMainImageUploader';
import { ILogoUploader } from '../../../../../shared/application/file-upload/images/ports/ILogoUploader';

type Dependencies = {
  readonly logoUploader: ILogoUploader;
  readonly mainImageUploader: IMainImageUploader;
  readonly batchGalleryImagesUploader: IBatchGalleryImagesUploader;
  readonly createTeamUseCase: ICreateTeamUseCase;
};

export class ExpressCreateTeamPOSTController implements ExpressBaseController {
  readonly #imageUploadMiddleware: multer.Multer;

  private constructor(private readonly dependencies: Dependencies) {
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

  public static create(dependencies: Dependencies): ExpressCreateTeamPOSTController {
    return new ExpressCreateTeamPOSTController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const createTeamDTO: CreateTeamDTO = request.body;

    if (request.files && 'logo' in request.files) {
      createTeamDTO.logo = await this.#uploadLogo((request.files as { logo: Express.Multer.File[] }).logo[0]);
    }

    if (request.files && 'mainImage' in request.files) {
      createTeamDTO.mainImage = await this.#uploadMainImage((request.files as { mainImage: Express.Multer.File[] }).mainImage[0]);
    }

    if (request.files && 'gallery' in request.files) {
      createTeamDTO.gallery = {
        images: await this.#uploadGalleryImages((request.files as { gallery: Express.Multer.File[] }).gallery),
      };
    }

    await this.dependencies.createTeamUseCase.execute(createTeamDTO, request.userContext);
    response.status(HttpStatus.CREATED).send();
  }

  public getImagesUploadMiddleware(): RequestHandler {
    return this.#imageUploadMiddleware.fields([
      { name: 'logo', maxCount: 1 },
      { name: 'mainImage', maxCount: 1 },
      { name: 'gallery', maxCount: 10 },
    ]);
  }

  async #uploadMainImage(file: Express.Multer.File) {
    const imageFile: ImageFile = this.#createImageFile(file);
    const mainImage = await this.dependencies.mainImageUploader.uploadMainImage(imageFile);
    const formattedDate = DateValueObject.getCurrentDate().dateAsString;

    return {
      url: mainImage.url,
      uploadedAt: formattedDate,
      alt: imageFile.originalName,
      dimensions: {
        width: mainImage.metadata.width,
        height: mainImage.metadata.height,
      },
    };
  }

  async #uploadLogo(file: Express.Multer.File) {
    const imageFile: ImageFile = this.#createImageFile(file);
    const logo = await this.dependencies.logoUploader.uploadLogo(imageFile);
    const formattedDate = DateValueObject.getCurrentDate().dateAsString;

    return {
      url: logo.url,
      uploadedAt: formattedDate,
      alt: imageFile.originalName,
      dimensions: {
        width: logo.metadata.width,
        height: logo.metadata.height,
      },
    };
  }

  async #uploadGalleryImages(files: Express.Multer.File[]) {
    if (files.length === 0) return [];

    const galleryImages = files.map(this.#createImageFile);
    const gallery = await this.dependencies.batchGalleryImagesUploader.uploadGalleryImages(galleryImages);
    const formattedDate = DateValueObject.getCurrentDate().dateAsString;

    return gallery.successful.map((image, idx) => ({
      url: image.url,
      uploadedAt: formattedDate,
      alt: galleryImages[idx].originalName,
      dimensions: {
        width: image.metadata.width,
        height: image.metadata.height,
      },
    }));
  }

  #createImageFile(file: Express.Multer.File): ImageFile {
    return {
      buffer: file.buffer,
      metadata: {
        mimetype: file.mimetype,
        encoding: file.encoding,
        filename: file.originalname,
        size: file.size,
      },
      originalName: file.originalname,
    };
  }
}
