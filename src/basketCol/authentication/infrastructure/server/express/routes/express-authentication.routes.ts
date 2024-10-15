import { Router } from 'express';

import {
  authenticateUserPOSTController,
  getAuthenticatedUserGETController,
  validateAndRefreshAuthenticationTokenPOSTController,
} from '../../../dependency-injection';
import { expressInputValidationMiddleware } from '../../../../../shared/infrastructure/server/express/routes/middlewares/express-input-validation.middleware';
import { authenticateUserPOSTControllerValidations } from './validations/authenticate-user-post-controller.validations';

const register = (router: Router) => {
  router.post(
    '/authentication/tokens',
    authenticateUserPOSTControllerValidations,
    expressInputValidationMiddleware,
    authenticateUserPOSTController.run.bind(authenticateUserPOSTController),
  );

  router.post(
    '/authentication/tokens/refresh',
    validateAndRefreshAuthenticationTokenPOSTController.run.bind(validateAndRefreshAuthenticationTokenPOSTController),
  );

  router.get(
    '/authentication/users/me',
    getAuthenticatedUserGETController.run.bind(getAuthenticatedUserGETController),
  );
};

export default register;
