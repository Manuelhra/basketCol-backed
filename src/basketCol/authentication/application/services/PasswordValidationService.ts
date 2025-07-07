// TODO: Validar que todo lo que sean interfaces esten en la caperta ports y empiecen con la letra I

import { IPasswordHashingDomainService, UserPassword } from '@basketcol/domain';

type Dependencies = {
  readonly passwordHashingDomainService: IPasswordHashingDomainService;
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
