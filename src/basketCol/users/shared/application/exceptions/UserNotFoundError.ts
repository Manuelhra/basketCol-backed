import { RootError } from '@basketcol/domain';

export class UserNotFoundError extends RootError {
  constructor(userId: string) {
    const message = `User with ID ${userId} was not found.`;
    super(message);
    this.name = 'UserNotFoundError';
  }

  public override logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
