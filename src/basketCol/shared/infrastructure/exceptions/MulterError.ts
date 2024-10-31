import { RootError } from '@basketcol/domain';

export class MulterError extends RootError {
  private constructor(code: string, message: string) {
    const errorMessage = `Multer error - ${code}: ${message}`;
    super(errorMessage);
    this.name = 'MulterError';
  }

  public static create(code: string, message: string): MulterError {
    return new MulterError(code, message);
  }

  public override logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
