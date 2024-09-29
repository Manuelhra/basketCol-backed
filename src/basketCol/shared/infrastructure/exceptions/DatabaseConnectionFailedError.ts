import { RootError } from '@basketcol/domain';

export class DatabaseConnectionFailedError extends RootError {
  private constructor(details: string) {
    const message = `Database connection failed: ${details}`;
    super(message);
    this.name = 'DatabaseConnectionFailedError';
  }

  public static create(details: string): DatabaseConnectionFailedError {
    return new DatabaseConnectionFailedError(details);
  }

  public override logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
