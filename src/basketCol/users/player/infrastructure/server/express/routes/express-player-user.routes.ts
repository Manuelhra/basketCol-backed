import { Router } from 'express';

import { createPlayerUserPOSTController } from '../../../dependency-injection';
import { expressInputValidationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-input-validation.middleware';
import { expressAuthenticationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-authentication.middleware';
import { httpResponseHandler, tokenValidatorService } from '../../../../../../shared/infrastructure/dependency-injection';
import { expressUserTypeAuthorizationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-user-type-authorization.middleware';
import { createPlayerUserPOSTControllerValidations } from './validations/create-player-user-post-controller.validations';

const register = (router: Router) => {
  const pathPrefix: string = '/users';

  router.post(
    `${pathPrefix}/players`,
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER'], httpResponseHandler),
    createPlayerUserPOSTControllerValidations,
    expressInputValidationMiddleware,
    createPlayerUserPOSTController.run.bind(createPlayerUserPOSTController),
  );
};

export default register;
