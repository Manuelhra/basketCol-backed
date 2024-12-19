import { convictConfig } from '../../../../../config';

export abstract class UserAuthenticationJwtConfigFactory {
  public static createAuthenticateUserConfig(): { secretKey: string; expiresIn: string } {
    return {
      secretKey: convictConfig.get('jwt.secretKeys.authenticateUserSecretKey'),
      expiresIn: '20d',
    };
  }
}
