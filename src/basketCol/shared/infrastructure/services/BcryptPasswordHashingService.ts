import { IPasswordHashingService } from '@basketcol/domain';
import bcrypt from 'bcrypt';

export class BcryptPasswordHashingService implements IPasswordHashingService {
  public static create(): BcryptPasswordHashingService {
    return new BcryptPasswordHashingService();
  }

  public async hash(password: string): Promise<string> {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  public async verifyPassword(password: string, encryptedPassword: string): Promise<boolean> {
    return bcrypt.compareSync(password, encryptedPassword);
  }
}
