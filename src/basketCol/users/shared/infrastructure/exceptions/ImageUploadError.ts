import { RootError } from '@basketcol/domain';

export class ImageUploadError extends RootError {
  private constructor(message: string) {
    super(message);
    this.name = 'ImageUploadError';
  }

  public static create(message: string): ImageUploadError {
    return new ImageUploadError(message);
  }

  public override logError(): string {
    return `${this.name}: ${this.message}`;
  }
}

export enum ImageUploadErrorCode {
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  BUCKET_NOT_FOUND = 'BUCKET_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN = 'UNKNOWN',
}
