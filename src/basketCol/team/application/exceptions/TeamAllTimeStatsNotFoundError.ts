import { RootError } from '@basketcol/domain';

export class TeamAllTimeStatsNotFoundForPlayerError extends RootError {
  private constructor(message: string) {
    super(message);
    this.name = 'TeamAllTimeStatsNotFoundForPlayerError';
  }

  public static create(message: string): TeamAllTimeStatsNotFoundForPlayerError {
    return new TeamAllTimeStatsNotFoundForPlayerError(message);
  }

  public logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
