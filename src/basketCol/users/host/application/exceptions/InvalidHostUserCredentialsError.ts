import { RootError } from '@basketcol/domain';

export class InvalidHostUserCredentialsError extends RootError {
  constructor() {
    super('Invalid host user credentials provided.');

    this.name = 'InvalidHostUserCredentialsError';
  }

  public override logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
