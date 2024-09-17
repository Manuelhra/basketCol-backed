import { Router } from 'express';

import { createHostUserPOSTController } from '../../../dependency-injection';
import { createHostUserPOSTControllerValidations } from './validations/create-host-user-post-controller.validations';
import { expressInputValidationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-input-validation.middleware';

const register = (router: Router) => {
  router.post(
    '/host-user',
    createHostUserPOSTControllerValidations,
    expressInputValidationMiddleware,
    createHostUserPOSTController.run.bind(createHostUserPOSTController),
  );
};

export default register;
