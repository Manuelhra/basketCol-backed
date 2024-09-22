import { IUserContext } from './IUserContext';

export class UserContext implements IUserContext {
  public readonly userId: string;

  public readonly userType: string;

  constructor(userId: string, userType: string) {
    this.userId = userId;
    this.userType = userType;
  }

  public static create(userId: string, userType: string): UserContext {
    return new UserContext(userId, userType);
  }
}
