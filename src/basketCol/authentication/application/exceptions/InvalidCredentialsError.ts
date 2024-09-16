import { RootError } from '@basketcol/domain';

export class InvalidCredentialsError extends RootError {
  constructor() {
    const message = 'Invalid credentials provided';
    super(message);
    this.name = 'InvalidCredentialsError';
  }

  public override logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
