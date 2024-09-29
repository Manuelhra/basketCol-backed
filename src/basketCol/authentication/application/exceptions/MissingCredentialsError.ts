import { RootError } from '@basketcol/domain';

export class MissingCredentialsError extends RootError {
  private constructor() {
    const message = 'Authentication requires either a nickname or an email, but neither was provided.';
    super(message);
    this.name = 'MissingCredentialsError';
  }

  public static create(): MissingCredentialsError {
    return new MissingCredentialsError();
  }

  public override logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
