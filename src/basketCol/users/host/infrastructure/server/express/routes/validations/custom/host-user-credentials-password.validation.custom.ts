import { convictConfig } from '../../../../../../../../../config';
import { InvalidHostUserCredentialsError } from '../../../../../../application/exceptions/InvalidHostUserCredentialsError';

export const hostUserCredentialsPasswordValidation = (userPassword: string) => {
  const hostUserCredentials = convictConfig.get('hostUserCredentials');

  if (hostUserCredentials.password !== userPassword) {
    throw InvalidHostUserCredentialsError.create();
  }

  return true;
};
