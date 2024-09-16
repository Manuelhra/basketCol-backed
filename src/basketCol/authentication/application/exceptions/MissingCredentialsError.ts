import { RootError } from '@basketcol/domain';

export class MissingCredentialsError extends RootError {
  constructor() {
    const message = 'Authentication requires either a nickname or an email, but neither was provided.';
    super(message);
    this.name = 'MissingCredentialsError';
  }

  public override logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
