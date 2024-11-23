import { Router } from 'express';

import { expressServiceAvailabilityMiddleware } from '../../../../../shared/infrastructure/server/express/routes/middlewares/express-service-availability.middleware';
import { httpResponseHandler, tokenValidatorService } from '../../../../../shared/infrastructure/dependency-injection';
import { createTeamPOSTController, findTeamByIdGETController, searchAllTeamsGETController } from '../../../dependency-injection';
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
    pathPrefix,
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

  // Endpoint - Find team by ID
  router.get(
    `${pathPrefix}/:teamId`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Find team by ID',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    findTeamByIdGETController.run.bind(findTeamByIdGETController),
  );

  // Endpoint - Search all teams
  router.get(
    pathPrefix,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Search all teams',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    searchAllTeamsGETController.run.bind(searchAllTeamsGETController),
  );
};

export default register;
