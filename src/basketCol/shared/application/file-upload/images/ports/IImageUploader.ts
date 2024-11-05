export interface ImageMetadata {
  readonly filename: string;
  readonly mimetype: string;
  readonly encoding: string;
  readonly size: number;
}

export interface ImageFile {
  originalName: string;
  buffer: Buffer;
  metadata: ImageMetadata;
}

export interface UploadImageOptions {
  readonly maxSizeInBytes?: number;
  readonly allowedMimeTypes?: string[];
  readonly compressionQuality?: number;
  readonly resizeDimensions?: {
    width: number;
    height: number;
  };
}

export interface UploadedImageResult {
  readonly url: string;
  readonly key: string;
  readonly metadata: {
    readonly size: number;
    readonly mimetype: string;
    readonly width: number;
    readonly height: number;
    readonly createdAt: string; // DD/MM/YYYY HH:mm:ss
  };
}

export interface IImageUploader {
  /**
   * Sube una imagen al almacenamiento en la nube
   * @param imageFile - Objeto que contiene el buffer y metadata de la imagen
   * @param options - Opciones de configuración para la subida
   * @throws {ImageUploadError} Si ocurre algún error durante la subida
   * @returns Promise con el resultado de la subida
   */
  uploadImage(
    imageFile: ImageFile,
    options?: UploadImageOptions
  ): Promise<UploadedImageResult>;

  /**
   * Elimina una imagen del almacenamiento
   * @param imageKey - Clave única de la imagen en el almacenamiento
   * @throws {ImageUploadError} Si ocurre algún error durante la eliminación
   */
  deleteImage(imageKey: string): Promise<void>;

  /**
   * Verifica si una imagen existe en el almacenamiento
   * @param imageKey - Clave única de la imagen en el almacenamiento
   * @returns Promise<boolean> que indica si la imagen existe
   */
  exists(imageKey: string): Promise<boolean>;
}
