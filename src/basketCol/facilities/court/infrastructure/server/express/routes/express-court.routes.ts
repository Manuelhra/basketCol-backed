import { Router } from 'express';

import { createCourtPOSTController, searchAllCourtsGETController } from '../../../dependency-injection';
import { ExpressCreateCourtPOSTController } from '../controllers/ExpressCreateCourtPOSTController';
import { expressExtractDataFromBodyMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-extract-data-from-body.middleware';
import { httpResponseHandler, tokenValidatorService } from '../../../../../../shared/infrastructure/dependency-injection';
import { expressAuthenticationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-authentication.middleware';
import { expressUserTypeAuthorizationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-user-type-authorization.middleware';
import { createCourtPOSTControllerValidations } from './validations/create-court-post-controller.validations';
import { expressInputValidationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-input-validation.middleware';
import { expressServiceAvailabilityMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-service-availability.middleware';

const register = (router: Router) => {
  const pathPrefix: string = '/facilities/courts';

  // Endpoint - Create court
  router.post(
    `${pathPrefix}`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Create court',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER'], httpResponseHandler),
    (createCourtPOSTController as ExpressCreateCourtPOSTController).getImagesUploadMiddleware(),
    expressExtractDataFromBodyMiddleware(httpResponseHandler),
    createCourtPOSTControllerValidations,
    expressInputValidationMiddleware,
    createCourtPOSTController.run.bind(createCourtPOSTController),
  );

  // Endpoint - Search All courts
  router.get(
    `${pathPrefix}`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Search all courts',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    searchAllCourtsGETController.run.bind(searchAllCourtsGETController),
  );
};

export default register;
