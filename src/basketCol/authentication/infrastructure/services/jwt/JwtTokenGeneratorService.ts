import { IUser, User } from '@basketcol/domain';
import jwt from 'jsonwebtoken';

import { ITokenGeneratorService } from '../../../application/services/ITokenGeneratorService';
import { UserAuthenticationJwtConfigFactory } from './UserAuthenticationJwtConfigFactory';
import { IUserAuthenticationTokenPayload } from '../../../application/services/IUserAuthenticationTokenPayload';

export class JwtTokenGeneratorService implements ITokenGeneratorService {
  public generateAuthenticationToken<IT extends IUser, T extends User<IT>>(user: T): string {
    const payload: IUserAuthenticationTokenPayload = {
      userId: user.id.value,
      userEmail: user.email.value,
      userType: user.type.value,
    };

    const { secretKey, expiresIn } = UserAuthenticationJwtConfigFactory.createAuthenticateUserConfig();

    return jwt.sign(payload, secretKey, { expiresIn });
  }
}
