import { RootError } from '@basketcol/domain';

export class MultipleHostUsersException extends RootError {
  constructor() {
    super('Uniqueness constraint violated: attempt to create multiple host users');

    this.name = 'MultipleHostUsersException';
  }

  public logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
