import { IPasswordEncrypterService, UserPassword } from '@basketcol/domain';

export class PasswordValidationService {
  readonly #passwordEncrypterService: IPasswordEncrypterService;

  constructor(passwordEncrypterService: IPasswordEncrypterService) {
    this.#passwordEncrypterService = passwordEncrypterService;
  }

  public validate<T extends UserPassword>(plainTextPassword: T, hashedPassword: T): boolean {
    return this.#passwordEncrypterService.compareEncryptedString(plainTextPassword.value, hashedPassword.value);
  }
}
