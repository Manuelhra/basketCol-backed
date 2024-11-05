import {
  IImageUploader, ImageFile, UploadedImageResult, UploadImageOptions,
} from './IImageUploader';

export interface BatchImageUploadOptions extends UploadImageOptions {
  readonly maxConcurrentUploads?: number;
  readonly maxBatchSize?: number;
}

export interface BatchUploadProgress {
  readonly total: number;
  readonly completed: number;
  readonly failed: number;
  readonly inProgress: number;
}

export interface BatchUploadResult {
  successful: UploadedImageResult[];
  failed: Array<{
    originalName: string;
    error: Error;
  }>;
  totalProcessed: number;
  totalFailed: number;
}

export interface IBatchImageUploader extends IImageUploader {
  /**
   * Sube múltiples imágenes al almacenamiento en la nube
   * @param imageFiles - Array de objetos ImageFile que contienen los buffers y metadata de las imágenes
   * @param options - Opciones de configuración para la subida por lotes
   * @param onProgress - Callback opcional para reportar el progreso de la subida
   * @throws {BatchImageUploadError} Si ocurre algún error crítico durante la subida por lotes
   * @returns Promise con el resultado de la subida por lotes
   */
  uploadImages(
    imageFiles: ImageFile[],
    options?: BatchImageUploadOptions,
    onProgress?: (progress: BatchUploadProgress) => void
  ): Promise<BatchUploadResult>;

  /**
   * Elimina múltiples imágenes del almacenamiento
   * @param imageKeys - Array de claves únicas de las imágenes en el almacenamiento
   * @throws {BatchImageDeleteError} Si ocurre algún error durante la eliminación por lotes
   * @returns Promise con el resultado de la eliminación por lotes
   */
  deleteImages(imageKeys: string[]): Promise<{
    successful: string[];
    failed: Array<{
      key: string;
      error: Error;
    }>;
  }>;

  /**
   * Verifica la existencia de múltiples imágenes en el almacenamiento
   * @param imageKeys - Array de claves únicas de las imágenes
   * @returns Promise con un mapa de resultados indicando la existencia de cada imagen
   */
  existsMany(imageKeys: string[]): Promise<Map<string, boolean>>;
}

export class BatchImageUploadError extends Error {
  constructor(
    message: string,
    public readonly partialResults?: BatchUploadResult,
  ) {
    super(message);
    this.name = 'BatchImageUploadError';
  }
}
