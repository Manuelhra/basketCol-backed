import { IPasswordHashingService, UserPassword } from '@basketcol/domain';

type Dependencies = {
  passwordHashingService: IPasswordHashingService;
};

export class PasswordValidationService {
  readonly #passwordHashingService: IPasswordHashingService;

  private constructor(dependencies: Dependencies) {
    this.#passwordHashingService = dependencies.passwordHashingService;
  }

  public static create(dependencies: Dependencies): PasswordValidationService {
    return new PasswordValidationService(dependencies);
  }

  public validate<T extends UserPassword>(plainTextPassword: T, hashedPassword: T): Promise<boolean> {
    return this.#passwordHashingService.verifyPassword(plainTextPassword.value, hashedPassword.value);
  }
}
