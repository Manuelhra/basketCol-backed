import { IPasswordHashingDomainService, UserPassword } from '@basketcol/domain';

type Dependencies = {
  passwordHashingDomainService: IPasswordHashingDomainService;
};

export class PasswordValidationService {
  readonly #passwordHashingDomainService: IPasswordHashingDomainService;

  private constructor(dependencies: Dependencies) {
    this.#passwordHashingDomainService = dependencies.passwordHashingDomainService;
  }

  public static create(dependencies: Dependencies): PasswordValidationService {
    return new PasswordValidationService(dependencies);
  }

  public validate<T extends UserPassword>(plainTextPassword: T, hashedPassword: T): Promise<boolean> {
    return this.#passwordHashingDomainService.verifyPassword(plainTextPassword.value, hashedPassword.value);
  }
}
