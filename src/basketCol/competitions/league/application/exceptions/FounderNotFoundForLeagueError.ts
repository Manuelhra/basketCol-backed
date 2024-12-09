import { RootError } from '@basketcol/domain';

export class FounderNotFoundForLeagueError extends RootError {
  private constructor(message: string) {
    super(message);
    this.name = 'FounderNotFoundForLeagueError';
  }

  public static create(message: string): FounderNotFoundForLeagueError {
    return new FounderNotFoundForLeagueError(message);
  }

  public logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
