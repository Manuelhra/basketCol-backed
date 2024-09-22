import { IUserAuthenticationTokenPayload } from './IUserAuthenticationTokenPayload';

export interface ITokenValidatorService {
  validateAuthenticationToken(token: string): IUserAuthenticationTokenPayload | null;
}
