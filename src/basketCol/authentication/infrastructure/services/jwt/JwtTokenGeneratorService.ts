import { IUserPrimitives, User } from '@basketcol/domain';
import jwt from 'jsonwebtoken';

import { ITokenGeneratorService } from '../../../application/services/ITokenGeneratorService';
import { IUserAuthenticationTokenPayload } from '../../../application/services/IUserAuthenticationTokenPayload';
import { UserAuthenticationJwtConfigFactory } from '../../factories/jwt/UserAuthenticationJwtConfigFactory';

export class JwtTokenGeneratorService implements ITokenGeneratorService {
  public static create(): JwtTokenGeneratorService {
    return new JwtTokenGeneratorService();
  }

  public generateAuthenticationToken<IT extends IUserPrimitives, T extends User<IT>>(user: T): string {
    const payload: IUserAuthenticationTokenPayload = {
      userId: user.id.value,
      userEmail: user.email.value,
      userType: user.type.value,
    };

    const { secretKey, expiresIn } = UserAuthenticationJwtConfigFactory.createAuthenticateUserConfig();

    return jwt.sign(payload, secretKey, { expiresIn });
  }
}
