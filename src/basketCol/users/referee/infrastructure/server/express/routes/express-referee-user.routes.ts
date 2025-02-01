import { Router } from 'express';

import { httpResponseHandler, tokenValidatorService } from '../../../../../../shared/infrastructure/dependency-injection';
import { expressAuthenticationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-authentication.middleware';
import { expressExtractDataFromBodyMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-extract-data-from-body.middleware';
import { expressInputValidationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-input-validation.middleware';
import { expressUserTypeAuthorizationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-user-type-authorization.middleware';
import { createRefereeUserPOSTController } from '../../../dependency-injection';
import { ExpressCreateRefereeUserPOSTController } from '../controllers/ExpressCreateRefereeUserPOSTController';
import { createRefereeUserPOSTControllerValidations } from './validations/create-referee-user-post-controller.validations';
import { expressServiceAvailabilityMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-service-availability.middleware';

const register = (router: Router) => {
  const pathPrefix: string = '/users/referees';

  // Endpoint - Create referee user
  router.post(
    `${pathPrefix}`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Create referee user',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER'], httpResponseHandler),
    (createRefereeUserPOSTController as ExpressCreateRefereeUserPOSTController).getImageUploadMiddleware(),
    expressExtractDataFromBodyMiddleware(httpResponseHandler),
    createRefereeUserPOSTControllerValidations,
    expressInputValidationMiddleware,
    createRefereeUserPOSTController.run.bind(createRefereeUserPOSTController),
  );
};

export default register;
