import { RootError } from '@basketcol/domain';

export class TeamNotParticipatingInFixtureGameError extends RootError {
  private constructor(teamId: string, homeTeamId: string, awayTeamId: string) {
    const message = `Team with id ${teamId} is not participating in this fixture game. Must be either home team (${homeTeamId}) or away team (${awayTeamId}).`;
    super(message);
    this.name = 'TeamNotParticipatingInFixtureGameError';
  }

  public static create(teamId: string, homeTeamId: string, awayTeamId: string): TeamNotParticipatingInFixtureGameError {
    return new TeamNotParticipatingInFixtureGameError(teamId, homeTeamId, awayTeamId);
  }

  public override logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
