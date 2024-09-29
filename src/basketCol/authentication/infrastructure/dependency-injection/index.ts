import { DependencyContainerNotInitializedError } from '../../../shared/infrastructure/exceptions/DependencyContainerNotInitializedError';
import { AwilixAuthenticationDependencyInjector } from './awilix/AwilixAuthenticationDependencyInjector';

const awilixAuthenticationContainer = AwilixAuthenticationDependencyInjector.create().getContainer();

if (awilixAuthenticationContainer === null) {
  throw DependencyContainerNotInitializedError.create();
}

export const authenticateUserPOSTController = awilixAuthenticationContainer.resolve('authenticateUserPOSTController');
export const authenticationRouteManager = awilixAuthenticationContainer.resolve('authenticationRouteManager');
export const authenticationServerErrorHandler = awilixAuthenticationContainer.resolve('authenticationServerErrorHandler');
export const validateAndRefreshAuthenticationTokenPOSTController = awilixAuthenticationContainer.resolve('validateAndRefreshAuthenticationTokenPOSTController');
