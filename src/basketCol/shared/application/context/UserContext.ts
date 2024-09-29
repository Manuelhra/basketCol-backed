import { IUserContext } from './IUserContext';

export class UserContext implements IUserContext {
  readonly #userId: string;

  readonly #userType: string;

  private constructor(userId: string, userType: string) {
    this.#userId = userId;
    this.#userType = userType;
  }

  public static create(userId: string, userType: string): UserContext {
    return new UserContext(userId, userType);
  }

  public get userId(): string {
    return this.#userId;
  }

  public get userType(): string {
    return this.#userType;
  }
}
