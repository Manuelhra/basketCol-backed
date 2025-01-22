import { RootError, TeamId } from '@basketcol/domain';

export class TeamAllTimeStatsNotFoundError extends RootError {
  private constructor(teamId: TeamId) {
    super(`Team all-time stats with teamId ${teamId.value} not found.`);

    this.name = 'TeamAllTimeStatsNotFoundError';
  }

  public static create(teamId: TeamId): TeamAllTimeStatsNotFoundError {
    return new TeamAllTimeStatsNotFoundError(teamId);
  }

  public override logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
