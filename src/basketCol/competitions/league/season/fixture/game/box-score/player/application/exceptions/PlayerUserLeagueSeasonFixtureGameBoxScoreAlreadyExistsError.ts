import { RootError } from '@basketcol/domain';

export class PlayerUserLeagueSeasonFixtureGameBoxScoreAlreadyExistsError extends RootError {
  private constructor(playerUserId: string, fixtureGameId: string) {
    const message = `Player user league season fixture game box score already exists for player user ID: ${playerUserId}, fixture game ID: ${fixtureGameId}`;
    super(message);
    this.name = 'PlayerUserLeagueSeasonFixtureGameBoxScoreAlreadyExistsError';
  }

  public static create(playerUserId: string, fixtureGameId: string): PlayerUserLeagueSeasonFixtureGameBoxScoreAlreadyExistsError {
    return new PlayerUserLeagueSeasonFixtureGameBoxScoreAlreadyExistsError(playerUserId, fixtureGameId);
  }

  public override logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
