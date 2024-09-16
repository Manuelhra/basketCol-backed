import { IUser, User } from '@basketcol/domain';
import jwt from 'jsonwebtoken';

import { ITokenGeneratorService } from '../../../application/services/ITokenGeneratorService';
import { UserAuthenticationJwtConfigFactory } from './UserAuthenticationJwtConfigFactory';

export class JwtTokenGeneratorService implements ITokenGeneratorService {
  public generateAuthenticationToken<IT extends IUser, T extends User<IT>>(user: T): string {
    const payload: {
      id: string;
      email: { value: string; verified: boolean };
      type: string;
    } = {
      id: user.getId().value,
      email: user.getEmail().value,
      type: user.getType().value,
    };

    const { secretKey, expiresIn } = UserAuthenticationJwtConfigFactory.createAuthenticateUserConfig();

    return jwt.sign(payload, secretKey, { expiresIn });
  }
}
