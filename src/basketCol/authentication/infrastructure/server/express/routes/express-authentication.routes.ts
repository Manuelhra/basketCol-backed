import { Router } from 'express';

import { authenticateUserPOSTController, validateAndRefreshAuthenticationTokenPOSTController } from '../../../dependency-injection';
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
    expressInputValidationMiddleware,
    validateAndRefreshAuthenticationTokenPOSTController.run.bind(validateAndRefreshAuthenticationTokenPOSTController),
  );
};

export default register;
