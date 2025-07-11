import { convictConfig } from '../../../../../config';
import { IHostUserConfigFactory } from '../../application/ports/IHostUserConfigFactory';

export class HostUserConfigFactory implements IHostUserConfigFactory {
  public static create(): HostUserConfigFactory {
    return new HostUserConfigFactory();
  }

  public createHostUserCredentials(): { email: { value: string; }; password: string; } {
    return {
      email: convictConfig.get('hostUserCredentials.email'),
      password: convictConfig.get('hostUserCredentials.password'),
    };
  }
}
