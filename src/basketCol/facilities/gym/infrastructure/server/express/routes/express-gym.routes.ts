import { Router } from 'express';

import { createGymPOSTController, searchGymsGETController } from '../../../dependency-injection';
import { ExpressCreateGymPOSTController } from '../controllers/ExpressCreateGymPOSTController';
import { expressExtractDataFromBodyMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-extract-data-from-body.middleware';
import { httpResponseHandler, tokenValidatorService } from '../../../../../../shared/infrastructure/dependency-injection';
import { expressAuthenticationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-authentication.middleware';
import { expressUserTypeAuthorizationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-user-type-authorization.middleware';
import { createGymPOSTControllerValidations } from './validations/create-gym-post-controller.validations';
import { expressInputValidationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-input-validation.middleware';

const register = (router: Router) => {
  const pathPrefix: string = '/facilities';

  // Endpoint - Create gym
  router.post(
    `${pathPrefix}/gyms`,
    (createGymPOSTController as ExpressCreateGymPOSTController).getImagesUploadMiddleware(),
    expressExtractDataFromBodyMiddleware(httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER'], httpResponseHandler),
    createGymPOSTControllerValidations,
    expressInputValidationMiddleware,
    createGymPOSTController.run.bind(createGymPOSTController),
  );

  // Endpoint - Search gyms
  router.get(
    `${pathPrefix}/gyms`,
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    searchGymsGETController.run.bind(searchGymsGETController),
  );
};

export default register;
