import { Router } from 'express';

import { httpResponseHandler, tokenValidatorService } from '../../../../../../../../shared/infrastructure/dependency-injection';
import { expressAuthenticationMiddleware } from '../../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-authentication.middleware';
import { expressInputValidationMiddleware } from '../../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-input-validation.middleware';
import { expressServiceAvailabilityMiddleware } from '../../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-service-availability.middleware';
import { expressUserTypeAuthorizationMiddleware } from '../../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-user-type-authorization.middleware';
import { createLeagueSeasonAwardsPOSTController, findLeagueSeasonAwardsByLeagueSeasonIdGETController } from '../../../dependency-injection';
import { createLeagueSeasonAwardsPOSTControllerValidations } from './validations/create-league-season-awards-post-controller.validations';

const register = (router: Router) => {
  const pathPrefix: string = '/competitions/leagues/seasons';

  // Endpoint - Create league season awards
  router.post(
    `${pathPrefix}/awards`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Create league season awards',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER'], httpResponseHandler),
    createLeagueSeasonAwardsPOSTControllerValidations,
    expressInputValidationMiddleware,
    createLeagueSeasonAwardsPOSTController.run.bind(createLeagueSeasonAwardsPOSTController),
  );

  // Endpoint - Find league season awards by league season id
  router.get(
    `${pathPrefix}/:leagueSeasonId/awards`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Find league season awards by league season id',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    findLeagueSeasonAwardsByLeagueSeasonIdGETController.run.bind(findLeagueSeasonAwardsByLeagueSeasonIdGETController),
  );
};

export default register;
