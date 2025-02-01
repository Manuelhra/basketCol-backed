import { RootError } from '@basketcol/domain';

export class NoActiveTeamPlayerFoundError extends RootError {
  private constructor(playerUserId: string) {
    const message = `No active team player found for player user ID: ${playerUserId}`;
    super(message);
    this.name = 'NoActiveTeamPlayerFoundError';
  }

  public static create(playerUserId: string): NoActiveTeamPlayerFoundError {
    return new NoActiveTeamPlayerFoundError(playerUserId);
  }

  public override logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
