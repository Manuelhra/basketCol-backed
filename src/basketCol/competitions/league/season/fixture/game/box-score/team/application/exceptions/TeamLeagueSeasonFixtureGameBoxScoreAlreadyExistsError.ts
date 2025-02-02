import { RootError } from '@basketcol/domain';

export class TeamLeagueSeasonFixtureGameBoxScoreAlreadyExistsError extends RootError {
  private constructor(teamId: string, fixtureGameId: string) {
    const message = `Team league season fixture game box score already exists for team ID: ${teamId}, fixture game ID: ${fixtureGameId}`;
    super(message);
    this.name = 'TeamLeagueSeasonFixtureGameBoxScoreAlreadyExistsError';
  }

  public static create(teamId: string, fixtureGameId: string): TeamLeagueSeasonFixtureGameBoxScoreAlreadyExistsError {
    return new TeamLeagueSeasonFixtureGameBoxScoreAlreadyExistsError(teamId, fixtureGameId);
  }

  public override logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
