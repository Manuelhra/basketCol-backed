import { Router } from 'express';
import { authenticateUserPOSTController } from '../../../dependency-injection';
import { expressInputValidationMiddleware } from '../../../../../shared/infrastructure/server/express/routes/middlewares/express-input-validation.middleware';
import { authenticateUserPOSTControllerValidations } from './validations/authenticate-user-post-controller.validations';

const register = (router: Router) => {
  router.post(
    '/authentication/tokens',
    authenticateUserPOSTControllerValidations,
    expressInputValidationMiddleware,
    authenticateUserPOSTController.run.bind(authenticateUserPOSTController),
  );
};

export default register;
