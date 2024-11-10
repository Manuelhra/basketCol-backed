import { Router } from 'express';

import { expressAuthenticationMiddleware } from '../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-authentication.middleware';
import { httpResponseHandler, tokenValidatorService } from '../../../../../../../shared/infrastructure/dependency-injection';
import { expressUserTypeAuthorizationMiddleware } from '../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-user-type-authorization.middleware';
import { createLeagueSeasonPOSTControllerValidations } from './validations/create-league-season-post-controller.validations';
import { expressInputValidationMiddleware } from '../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-input-validation.middleware';
import { createLeagueSeasonPOSTController } from '../../../dependency-injection';
import { expressServiceAvailabilityMiddleware } from '../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-service-availability.middleware';

const register = (router: Router) => {
  const pathPrefix: string = '/competitions';

  // Endpoint - Create league season
  router.post(
    `${pathPrefix}/league-seasons`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Create league season',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER'], httpResponseHandler),
    createLeagueSeasonPOSTControllerValidations,
    expressInputValidationMiddleware,
    createLeagueSeasonPOSTController.run.bind(createLeagueSeasonPOSTController),
  );
};

export default register;
