import { Request, RequestHandler, Response } from 'express';
import multer from 'multer';
import { DateValueObject, HttpStatus } from '@basketcol/domain';

import { ExpressBaseController } from '../../../../../../shared/infrastructure/server/express/controllers/ExpressBaseController';
import { MulterError } from '../../../../../../shared/infrastructure/exceptions/MulterError';
import { CreateCourtDTO } from '../../../../application/dtos/CreateCourtDTO';
import { ImageFile } from '../../../../../../shared/application/file-upload/images/ports/IImageUploader';
import { ICreateCourtUseCase } from '../../../../application/use-cases/ports/ICreateCourtUseCase';
import { IMainImageUploader } from '../../../../../../shared/application/file-upload/images/ports/IMainImageUploader';
import { IBatchGalleryImagesUploader } from '../../../../../../shared/application/file-upload/images/ports/IBatchGalleryImagesUploader';

type Dependencies = {
  readonly mainImageUploader: IMainImageUploader;
  readonly batchGalleryImagesUploader: IBatchGalleryImagesUploader;
  readonly createCourtUseCase: ICreateCourtUseCase;
};

export class ExpressCreateCourtPOSTController implements ExpressBaseController {
  readonly #imageUploadMiddleware: multer.Multer;

  readonly #mainImageUploader: IMainImageUploader;

  readonly #batchGalleryImagesUploader: IBatchGalleryImagesUploader;

  readonly #createCourtUseCase: ICreateCourtUseCase;

  private constructor(dependencies: Dependencies) {
    this.#mainImageUploader = dependencies.mainImageUploader;
    this.#batchGalleryImagesUploader = dependencies.batchGalleryImagesUploader;
    this.#createCourtUseCase = dependencies.createCourtUseCase;
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

  public static create(dependencies: Dependencies): ExpressCreateCourtPOSTController {
    return new ExpressCreateCourtPOSTController(dependencies);
  }

  public async run(request: Request, response: Response): Promise<void> {
    const createCourtDTO: CreateCourtDTO = request.body;

    if (request.files && 'mainImage' in request.files) {
      createCourtDTO.mainImage = await this.#uploadMainImage((request.files as { mainImage: Express.Multer.File[] }).mainImage[0]);
    }

    if (request.files && 'gallery' in request.files) {
      createCourtDTO.gallery = {
        images: await this.#uploadGalleryImages((request.files as { gallery: Express.Multer.File[] }).gallery),
      };
    }

    await this.#createCourtUseCase.execute({
      ...createCourtDTO,
      facilityId: createCourtDTO.facilityId ?? null,
    }, request.userContext);
    response.status(HttpStatus.CREATED).send();
  }

  public getImagesUploadMiddleware(): RequestHandler {
    return this.#imageUploadMiddleware.fields([
      { name: 'mainImage', maxCount: 1 },
      { name: 'gallery', maxCount: 10 },
    ]);
  }

  async #uploadMainImage(file: Express.Multer.File) {
    const imageFile: ImageFile = this.#createImageFile(file);
    const mainImage = await this.#mainImageUploader.uploadMainImage(imageFile);
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

  async #uploadGalleryImages(files: Express.Multer.File[]) {
    if (files.length === 0) return [];

    const galleryImages = files.map(this.#createImageFile);
    const gallery = await this.#batchGalleryImagesUploader.uploadGalleryImages(galleryImages);
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
