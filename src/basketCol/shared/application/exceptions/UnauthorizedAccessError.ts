import { RootError } from '@basketcol/domain';
import { IUserContext } from '../context/ports/IUserContext';

export class UnauthorizedAccessError extends RootError {
  private constructor(userContext: IUserContext, requiredRole: string, action: string) {
    const message = `Access denied: User with ID '${userContext.userId}' and type '${userContext.userType}' is not authorized to ${action}. Required role: ${requiredRole}.`;
    super(message);
    this.name = 'UnauthorizedAccessError';
  }

  public static create(userContext: IUserContext, requiredRole: string, action: string): UnauthorizedAccessError {
    return new UnauthorizedAccessError(userContext, requiredRole, action);
  }

  public override logError(): string {
    return `${this.name}: ${this.message}`;
  }
}
