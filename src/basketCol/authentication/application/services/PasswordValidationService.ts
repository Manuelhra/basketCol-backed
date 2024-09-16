import { IPasswordEncrypterService, UserPassword } from '@basketcol/domain';

export class PasswordValidationService {
  readonly #passwordEncrypterService: IPasswordEncrypterService;

  public constructor(dependencies:{
    passwordEncrypterService: IPasswordEncrypterService;
  }) {
    this.#passwordEncrypterService = dependencies.passwordEncrypterService;
  }

  public validate<T extends UserPassword>(plainTextPassword: T, hashedPassword: T): boolean {
    return this.#passwordEncrypterService.compareEncryptedString(plainTextPassword.value, hashedPassword.value);
  }
}
