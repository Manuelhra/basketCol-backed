import { RootError } from '@basketcol/domain';

export class PlayerUserNotFoundForTeamPlayerError extends RootError {
  private constructor(playerUserId: string) {
    super(`Player user with ID ${playerUserId} not found in the system, despite having an associated team player record`);
    this.name = 'PlayerUserNotFoundForTeamPlayerError';
  }

  public static create(playerUserId: string): PlayerUserNotFoundForTeamPlayerError {
    return new PlayerUserNotFoundForTeamPlayerError(playerUserId);
  }

  public logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
