import { RootError } from '@basketcol/domain';

export class TeamNotFoundForPlayerError extends RootError {
  private constructor(teamId: string) {
    super(`Team with ID ${teamId} not found in the system, despite having an associated team player record`);
    this.name = 'TeamNotFoundForPlayerException';
  }

  public static create(teamId: string): TeamNotFoundForPlayerError {
    return new TeamNotFoundForPlayerError(teamId);
  }

  public logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
