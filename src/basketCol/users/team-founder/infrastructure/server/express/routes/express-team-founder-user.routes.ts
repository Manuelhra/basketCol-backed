import { Router } from 'express';

import { httpResponseHandler, tokenValidatorService } from '../../../../../../shared/infrastructure/dependency-injection';
import { expressAuthenticationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-authentication.middleware';
import { expressExtractDataFromBodyMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-extract-data-from-body.middleware';
import { expressInputValidationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-input-validation.middleware';
import { expressUserTypeAuthorizationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-user-type-authorization.middleware';
import { createTeamFounderUserPOSTController } from '../../../dependency-injection';
import { ExpressCreateTeamFounderUserPOSTController } from '../controllers/ExpressCreateTeamFounderUserPOSTController';
import { createTeamFounderUserPOSTControllerValidations } from './validations/create-team-founder-user-post-controller.validations';
import { expressServiceAvailabilityMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-service-availability.middleware';

const register = (router: Router) => {
  const pathPrefix: string = '/users';

  // Endpoint - Create a team founder user
  router.post(
    `${pathPrefix}/team-founders`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Create team founder user',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER'], httpResponseHandler),
    (createTeamFounderUserPOSTController as ExpressCreateTeamFounderUserPOSTController).getImageUploadMiddleware(),
    expressExtractDataFromBodyMiddleware(httpResponseHandler),
    createTeamFounderUserPOSTControllerValidations,
    expressInputValidationMiddleware,
    createTeamFounderUserPOSTController.run.bind(createTeamFounderUserPOSTController),
  );
};

export default register;
