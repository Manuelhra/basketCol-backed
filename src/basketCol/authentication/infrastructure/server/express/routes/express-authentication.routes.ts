import { Router } from 'express';

import {
  authenticateUserPOSTController,
  getAuthenticatedUserGETController,
  requestPasswordResetPOSTController,
  validateAndRefreshAuthenticationTokenPOSTController,
} from '../../../dependency-injection';
import { expressInputValidationMiddleware } from '../../../../../shared/infrastructure/server/express/routes/middlewares/express-input-validation.middleware';
import { authenticateUserPOSTControllerValidations } from './validations/authenticate-user-post-controller.validations';
import { requestPasswordResetPOSTControllerValidations } from './validations/request-password-reset-post-controller.validations';

const registerAuthenticationRoutes = (router: Router): void => {
  const pathPrefix: string = '/authentication';

  // Endpoint - Generate new access token
  router.post(
    `${pathPrefix}/tokens`,
    authenticateUserPOSTControllerValidations,
    expressInputValidationMiddleware,
    authenticateUserPOSTController.run.bind(authenticateUserPOSTController),
  );

  // Endpoint - Validate and refresh existing token
  router.post(
    `${pathPrefix}/tokens/refresh`,
    validateAndRefreshAuthenticationTokenPOSTController.run.bind(validateAndRefreshAuthenticationTokenPOSTController),
  );

  // Endpoint - Get authenticated user profile
  router.get(
    `${pathPrefix}/users/me`,
    getAuthenticatedUserGETController.run.bind(getAuthenticatedUserGETController),
  );

  // Endpoint - Request password reset
  router.post(
    `${pathPrefix}/password/request-reset`,
    requestPasswordResetPOSTControllerValidations,
    expressInputValidationMiddleware,
    requestPasswordResetPOSTController.run.bind(requestPasswordResetPOSTController),
  );
};

export default registerAuthenticationRoutes;
