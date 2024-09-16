import { RootError } from '@basketcol/domain';

export class MissingEmailError extends RootError {
  constructor() {
    const message = 'Authentication requires an email, but it was not provided.';
    super(message);
    this.name = 'MissingEmailError';
  }

  public override logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
