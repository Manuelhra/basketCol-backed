import jwt from 'jsonwebtoken';

import { ITokenValidatorService } from '../../../application/services/ITokenValidatorService';
import { UserAuthenticationJwtConfigFactory } from './UserAuthenticationJwtConfigFactory';
import { IUserAuthenticationTokenPayload } from '../../../application/services/IUserAuthenticationTokenPayload';

export class JwtTokenValidatorService implements ITokenValidatorService {
  public validateAuthenticationToken(token: string): IUserAuthenticationTokenPayload | null {
    const { secretKey } = UserAuthenticationJwtConfigFactory.createAuthenticateUserConfig();

    return jwt.verify(token, secretKey) as IUserAuthenticationTokenPayload;
  }
}
