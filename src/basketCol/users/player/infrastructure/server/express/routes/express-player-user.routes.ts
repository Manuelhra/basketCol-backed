import { Router } from 'express';

import {
  createPlayerUserPOSTController,
  findPlayerUserByIdGETController,
  searchAllPlayerUsersGETController,
} from '../../../dependency-injection';
import { expressInputValidationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-input-validation.middleware';
import { expressAuthenticationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-authentication.middleware';
import { httpResponseHandler, tokenValidatorService } from '../../../../../../shared/infrastructure/dependency-injection';
import { expressUserTypeAuthorizationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-user-type-authorization.middleware';
import { createPlayerUserPOSTControllerValidations } from './validations/create-player-user-post-controller.validations';
import { ExpressCreatePlayerUserPOSTController } from '../controllers/ExpressCreatePlayerUserPOSTController';
import { expressExtractDataFromBodyMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-extract-data-from-body.middleware';
import { expressServiceAvailabilityMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-service-availability.middleware';

const register = (router: Router) => {
  const pathPrefix: string = '/users';

  // Endpoint - Create player user
  router.post(
    `${pathPrefix}/players`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Create player user',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER'], httpResponseHandler),
    (createPlayerUserPOSTController as ExpressCreatePlayerUserPOSTController).getImageUploadMiddleware(),
    expressExtractDataFromBodyMiddleware(httpResponseHandler),
    createPlayerUserPOSTControllerValidations,
    expressInputValidationMiddleware,
    createPlayerUserPOSTController.run.bind(createPlayerUserPOSTController),
  );

  // Endpoint - Search all player users
  router.get(
    `${pathPrefix}/players`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Search all player users',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    searchAllPlayerUsersGETController.run.bind(searchAllPlayerUsersGETController),
  );

  // Endpoint - Find player user by ID
  router.get(
    `${pathPrefix}/players/:playerUserId`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Find player user by ID',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    findPlayerUserByIdGETController.run.bind(findPlayerUserByIdGETController),
  );
};

export default register;
