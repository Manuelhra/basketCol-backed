import { Router } from 'express';

import { expressAuthenticationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-authentication.middleware';
import { httpResponseHandler, tokenValidatorService } from '../../../../../../shared/infrastructure/dependency-injection';
import { expressUserTypeAuthorizationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-user-type-authorization.middleware';
import { createLeaguePOSTControllerValidations } from './validations/create-league-post-controller.validations';
import { expressInputValidationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-input-validation.middleware';
import { createLeaguePOSTController, searchLeaguesGETController } from '../../../dependency-injection';

const register = (router: Router) => {
  const pathPrefix: string = '/competitions';

  // Endpoint - Create league
  router.post(
    `${pathPrefix}/leagues`,
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER'], httpResponseHandler),
    createLeaguePOSTControllerValidations,
    expressInputValidationMiddleware,
    createLeaguePOSTController.run.bind(createLeaguePOSTController),
  );

  // Endpoint - Search leagues
  router.get(
    `${pathPrefix}/leagues`,
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    searchLeaguesGETController.run.bind(searchLeaguesGETController),
  );
};

export default register;
