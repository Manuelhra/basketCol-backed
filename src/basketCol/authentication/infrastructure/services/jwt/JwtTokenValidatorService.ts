import jwt from 'jsonwebtoken';

import { ITokenValidatorService } from '../../../application/services/ITokenValidatorService';
import { UserAuthenticationJwtConfigFactory } from './UserAuthenticationJwtConfigFactory';
import { IUserAuthenticationTokenPayload } from '../../../application/services/IUserAuthenticationTokenPayload';
import { InvalidAuthenticationTokenError } from '../../../application/exceptions/InvalidAuthenticationTokenError';

export class JwtTokenValidatorService implements ITokenValidatorService {
  public static create(): JwtTokenValidatorService {
    return new JwtTokenValidatorService();
  }

  public validateAuthenticationToken(token: string): IUserAuthenticationTokenPayload | null {
    const { secretKey } = UserAuthenticationJwtConfigFactory.createAuthenticateUserConfig();

    try {
      return jwt.verify(token, secretKey) as IUserAuthenticationTokenPayload;
    } catch (error) {
      throw new InvalidAuthenticationTokenError();
    }
  }
}
