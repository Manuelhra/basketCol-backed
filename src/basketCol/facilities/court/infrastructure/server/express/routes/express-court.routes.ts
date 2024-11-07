import { Router } from 'express';

import { createCourtPOSTController, searchCourtsGETController } from '../../../dependency-injection';
import { ExpressCreateCourtPOSTController } from '../controllers/ExpressCreateCourtPOSTController';
import { expressExtractDataFromBodyMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-extract-data-from-body.middleware';
import { httpResponseHandler, tokenValidatorService } from '../../../../../../shared/infrastructure/dependency-injection';
import { expressAuthenticationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-authentication.middleware';
import { expressUserTypeAuthorizationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-user-type-authorization.middleware';
import { createCourtPOSTControllerValidations } from './validations/create-court-post-controller.validations';
import { expressInputValidationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-input-validation.middleware';

const register = (router: Router) => {
  const pathPrefix: string = '/facilities';

  // Endpoint - Create court
  router.post(
    `${pathPrefix}/courts`,
    (createCourtPOSTController as ExpressCreateCourtPOSTController).getImagesUploadMiddleware(),
    expressExtractDataFromBodyMiddleware(httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER'], httpResponseHandler),
    createCourtPOSTControllerValidations,
    expressInputValidationMiddleware,
    createCourtPOSTController.run.bind(createCourtPOSTController),
  );

  // Endpoint - Search courts
  router.get(
    `${pathPrefix}/courts`,
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    searchCourtsGETController.run.bind(searchCourtsGETController),
  );
};

export default register;
