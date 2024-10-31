import { RootError } from '@basketcol/domain';

export class InvalidAuthenticationTokenError extends RootError {
  private constructor() {
    const message = 'The provided authentication token is invalid or has expired.';
    super(message);
    this.name = 'InvalidAuthenticationTokenError';
  }

  public static create(): InvalidAuthenticationTokenError {
    return new InvalidAuthenticationTokenError();
  }

  public override logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
