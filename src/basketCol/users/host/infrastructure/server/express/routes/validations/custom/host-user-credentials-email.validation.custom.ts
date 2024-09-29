import { convictConfig } from '../../../../../../../../../config';
import { InvalidHostUserCredentialsError } from '../../../../../../application/exceptions/InvalidHostUserCredentialsError';

export const hostUserCredentialsEmailValidation = (userEmailValue: string) => {
  const hostUserCredentials = convictConfig.get('hostUserCredentials');

  if (hostUserCredentials.email.value !== userEmailValue) {
    throw InvalidHostUserCredentialsError.create();
  }

  return true;
};
