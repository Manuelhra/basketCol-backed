import { IPasswordHashingService, UserPassword } from '@basketcol/domain';

export class PasswordValidationService {
  readonly #passwordHashingService: IPasswordHashingService;

  public constructor(dependencies:{
    passwordHashingService: IPasswordHashingService;
  }) {
    this.#passwordHashingService = dependencies.passwordHashingService;
  }

  public validate<T extends UserPassword>(plainTextPassword: T, hashedPassword: T): Promise<boolean> {
    return this.#passwordHashingService.verifyPassword(plainTextPassword.value, hashedPassword.value);
  }
}
