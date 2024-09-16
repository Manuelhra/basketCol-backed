import { RootError } from '@basketcol/domain';

export class DatabaseConnectionFailedError extends RootError {
  constructor(details: string) {
    const message = `Database connection failed: ${details}`;
    super(message);
    this.name = 'DatabaseConnectionFailedError';
  }

  public override logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
