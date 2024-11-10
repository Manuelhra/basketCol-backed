import { Router } from 'express';

import { expressAuthenticationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-authentication.middleware';
import { httpResponseHandler, tokenValidatorService } from '../../../../../../shared/infrastructure/dependency-injection';
import { expressUserTypeAuthorizationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-user-type-authorization.middleware';
import { createLeaguePOSTControllerValidations } from './validations/create-league-post-controller.validations';
import { expressInputValidationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-input-validation.middleware';
import { createLeaguePOSTController, searchAllLeaguesGETController } from '../../../dependency-injection';
import { expressServiceAvailabilityMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-service-availability.middleware';

const register = (router: Router) => {
  const pathPrefix: string = '/competitions';

  // Endpoint - Create league
  router.post(
    `${pathPrefix}/leagues`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Create league',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER'], httpResponseHandler),
    createLeaguePOSTControllerValidations,
    expressInputValidationMiddleware,
    createLeaguePOSTController.run.bind(createLeaguePOSTController),
  );

  // Endpoint - Search All leagues
  router.get(
    `${pathPrefix}/leagues`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Search all leagues',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    searchAllLeaguesGETController.run.bind(searchAllLeaguesGETController),
  );
};

export default register;
