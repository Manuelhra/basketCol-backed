import { RootError } from '@basketcol/domain';

export class InvalidCredentialsError extends RootError {
  private constructor() {
    const message = 'Invalid credentials provided';
    super(message);
    this.name = 'InvalidCredentialsError';
  }

  public static create(): InvalidCredentialsError {
    return new InvalidCredentialsError();
  }

  public override logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
