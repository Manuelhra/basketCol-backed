import { RootError } from '@basketcol/domain';

export class MultipleHostUsersException extends RootError {
  private constructor() {
    super('Uniqueness constraint violated: attempt to create multiple host users');

    this.name = 'MultipleHostUsersException';
  }

  public static create(): MultipleHostUsersException {
    return new MultipleHostUsersException();
  }

  public logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
