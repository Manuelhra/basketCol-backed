import { Router } from 'express';

import { createGymPOSTController, searchAllGymsGETController } from '../../../dependency-injection';
import { ExpressCreateGymPOSTController } from '../controllers/ExpressCreateGymPOSTController';
import { expressExtractDataFromBodyMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-extract-data-from-body.middleware';
import { httpResponseHandler, tokenValidatorService } from '../../../../../../shared/infrastructure/dependency-injection';
import { expressAuthenticationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-authentication.middleware';
import { expressUserTypeAuthorizationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-user-type-authorization.middleware';
import { createGymPOSTControllerValidations } from './validations/create-gym-post-controller.validations';
import { expressInputValidationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-input-validation.middleware';
import { expressServiceAvailabilityMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-service-availability.middleware';

const register = (router: Router) => {
  const pathPrefix: string = '/facilities/gyms';

  // Endpoint - Create gym
  router.post(
    `${pathPrefix}`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Create gym',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER'], httpResponseHandler),
    (createGymPOSTController as ExpressCreateGymPOSTController).getImagesUploadMiddleware(),
    expressExtractDataFromBodyMiddleware(httpResponseHandler),
    createGymPOSTControllerValidations,
    expressInputValidationMiddleware,
    createGymPOSTController.run.bind(createGymPOSTController),
  );

  // Endpoint - Search All gyms
  router.get(
    `${pathPrefix}`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Search all gyms',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    searchAllGymsGETController.run.bind(searchAllGymsGETController),
  );
};

export default register;
