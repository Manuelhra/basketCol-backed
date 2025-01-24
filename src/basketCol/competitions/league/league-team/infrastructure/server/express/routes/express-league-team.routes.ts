import { Router } from 'express';

import { expressAuthenticationMiddleware } from '../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-authentication.middleware';
import { httpResponseHandler, tokenValidatorService } from '../../../../../../../shared/infrastructure/dependency-injection';
import { expressUserTypeAuthorizationMiddleware } from '../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-user-type-authorization.middleware';
import { createLeagueTeamPOSTControllerValidations } from './validations/create-league-team-post-controller.validations';
import { expressInputValidationMiddleware } from '../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-input-validation.middleware';
import { createLeagueTeamPOSTController, findAllLeagueTeamsByLeagueIdGETController } from '../../../dependency-injection';
import { expressServiceAvailabilityMiddleware } from '../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-service-availability.middleware';

const register = (router: Router) => {
  const pathPrefix: string = '/competitions/leagues';

  // Endpoint - Create league team
  router.post(
    `${pathPrefix}/teams`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Create league team',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER'], httpResponseHandler),
    createLeagueTeamPOSTControllerValidations,
    expressInputValidationMiddleware,
    createLeagueTeamPOSTController.run.bind(createLeagueTeamPOSTController),
  );

  // Endpoint - Find all league teams by league id
  router.get(
    `${pathPrefix}/:leagueId/teams`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Find all league teams by league id',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    findAllLeagueTeamsByLeagueIdGETController.run.bind(findAllLeagueTeamsByLeagueIdGETController),
  );
};

export default register;
