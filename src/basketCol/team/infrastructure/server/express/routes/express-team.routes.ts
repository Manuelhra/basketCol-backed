import { Router } from 'express';

import { expressServiceAvailabilityMiddleware } from '../../../../../shared/infrastructure/server/express/routes/middlewares/express-service-availability.middleware';
import { httpResponseHandler, tokenValidatorService } from '../../../../../shared/infrastructure/dependency-injection';
import { createTeamPOSTController } from '../../../dependency-injection';
import { ExpressCreateTeamPOSTController } from '../controllers/ExpressCreateTeamPOSTController';
import { expressAuthenticationMiddleware } from '../../../../../shared/infrastructure/server/express/routes/middlewares/express-authentication.middleware';
import { expressUserTypeAuthorizationMiddleware } from '../../../../../shared/infrastructure/server/express/routes/middlewares/express-user-type-authorization.middleware';
import { expressExtractDataFromBodyMiddleware } from '../../../../../shared/infrastructure/server/express/routes/middlewares/express-extract-data-from-body.middleware';
import { createTeamPOSTControllerValidations } from './validations/create-team-post-controller.validations';
import { expressInputValidationMiddleware } from '../../../../../shared/infrastructure/server/express/routes/middlewares/express-input-validation.middleware';

const register = (router: Router) => {
  const pathPrefix: string = '/teams';

  // Endpoint - Create team
  router.post(
    `${pathPrefix}`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Create team',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER'], httpResponseHandler),
    (createTeamPOSTController as ExpressCreateTeamPOSTController).getImagesUploadMiddleware(),
    expressExtractDataFromBodyMiddleware(httpResponseHandler),
    createTeamPOSTControllerValidations,
    expressInputValidationMiddleware,
    createTeamPOSTController.run.bind(createTeamPOSTController),
  );
};

export default register;
