import { IPasswordEncrypterService } from '@basketcol/domain';
import bcrypt from 'bcrypt';

// TODO: Move la IPASSWORDEncrypter a la capa de infrastructue

export class BcryptPasswordEncrypter implements IPasswordEncrypterService {
  public encrypt(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  public compareEncryptedString(password: string, encryptedPassword: string): boolean {
    return bcrypt.compareSync(password, encryptedPassword);
  }
}
