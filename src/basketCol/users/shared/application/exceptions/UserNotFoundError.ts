import { RootError } from '@basketcol/domain';

export class UserNotFoundError extends RootError {
  private constructor(userId: string) {
    const message = `User with ID ${userId} was not found.`;
    super(message);
    this.name = 'UserNotFoundError';
  }

  public static create(userId: string): UserNotFoundError {
    return new UserNotFoundError(userId);
  }

  public override logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
