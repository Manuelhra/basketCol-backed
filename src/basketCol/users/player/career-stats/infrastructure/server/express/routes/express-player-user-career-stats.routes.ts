import { Router } from 'express';

import { httpResponseHandler, tokenValidatorService } from '../../../../../../../shared/infrastructure/dependency-injection';
import { expressAuthenticationMiddleware } from '../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-authentication.middleware';
import { expressUserTypeAuthorizationMiddleware } from '../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-user-type-authorization.middleware';
import { createPlayerUserCareerStatsPOSTControllerValidations } from './validations/create-player-user-career-stats-post-controller.validations';
import { expressInputValidationMiddleware } from '../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-input-validation.middleware';
import { createPlayerUserCareerStatsPOSTController, findCareerStatsByPlayerUserIdGETController } from '../../../dependency-injection';
import { expressServiceAvailabilityMiddleware } from '../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-service-availability.middleware';

const register = (router: Router): void => {
  const pathPrefix: string = '/users/players';
  const careerStatsPath = `${pathPrefix}/:playerUserId/career-stats`;

  // Endpoint - Create player user career stats
  router.post(
    careerStatsPath,
    expressServiceAvailabilityMiddleware({
      isEnabled: false,
      serviceName: 'Create player user career stats',
      customMessage: 'Create player user career stats service is disabled',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER'], httpResponseHandler),
    createPlayerUserCareerStatsPOSTControllerValidations,
    expressInputValidationMiddleware,
    createPlayerUserCareerStatsPOSTController.run.bind(createPlayerUserCareerStatsPOSTController),
  );

  // Endpoint - Find career stats by player user ID
  router.get(
    careerStatsPath,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Find career stats by player user ID',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    findCareerStatsByPlayerUserIdGETController.run.bind(findCareerStatsByPlayerUserIdGETController),
  );
};

export default register;
