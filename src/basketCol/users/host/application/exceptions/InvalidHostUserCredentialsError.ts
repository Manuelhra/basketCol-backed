import { RootError } from '@basketcol/domain';

export class InvalidHostUserCredentialsError extends RootError {
  private constructor() {
    super('Invalid host user credentials provided.');

    this.name = 'InvalidHostUserCredentialsError';
  }

  public static create(): InvalidHostUserCredentialsError {
    return new InvalidHostUserCredentialsError();
  }

  public override logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
