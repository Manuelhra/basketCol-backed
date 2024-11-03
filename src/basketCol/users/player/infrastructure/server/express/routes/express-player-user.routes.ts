import { Router } from 'express';

import { createPlayerUserPOSTController } from '../../../dependency-injection';
import { expressInputValidationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-input-validation.middleware';
import { expressAuthenticationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-authentication.middleware';
import { httpResponseHandler, tokenValidatorService } from '../../../../../../shared/infrastructure/dependency-injection';
import { expressUserTypeAuthorizationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-user-type-authorization.middleware';
import { createPlayerUserPOSTControllerValidations } from './validations/create-player-user-post-controller.validations';
import { ExpressCreatePlayerUserPOSTController } from '../controllers/ExpressCreatePlayerUserPOSTController';
import { expressExtractDataFromBodyMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-extract-data-from-body.middleware';

const register = (router: Router) => {
  const pathPrefix: string = '/users';

  // Endpoint - Create player user
  router.post(
    `${pathPrefix}/players`,
    (createPlayerUserPOSTController as ExpressCreatePlayerUserPOSTController).getImageUploadMiddleware(),
    expressExtractDataFromBodyMiddleware(httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER'], httpResponseHandler),
    createPlayerUserPOSTControllerValidations,
    expressInputValidationMiddleware,
    createPlayerUserPOSTController.run.bind(createPlayerUserPOSTController),
  );
};

export default register;
