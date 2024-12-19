import { Router } from 'express';

import { expressAuthenticationMiddleware } from '../../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-authentication.middleware';
import {
  bulkCreateLeagueSeasonFixtureFromExcelPOSTController,
  findAllLeagueSeasonFixturesByLeagueSeasonIdGETController,
  findLeagueSeasonFixtureByIdGETController,
} from '../../../dependency-injection';
import { ExpressBulkCreateLeagueSeasonFixtureFromExcelPOSTController } from '../controllers/ExpressBulkCreateLeagueSeasonFixtureFromExcelPOSTController';
import { expressUserTypeAuthorizationMiddleware } from '../../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-user-type-authorization.middleware';
import { httpResponseHandler, tokenValidatorService } from '../../../../../../../../shared/infrastructure/dependency-injection';
import { expressServiceAvailabilityMiddleware } from '../../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-service-availability.middleware';

const register = (router: Router) => {
  const pathPrefix: string = '/competitions';

  // Endpoint - Bulk create league season fixtures from Excel
  router.post(
    `${pathPrefix}/leagues/seasons/fixtures/bulk-upload/excel`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Bulk create league season fixtures from Excel',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER'], httpResponseHandler),
    (bulkCreateLeagueSeasonFixtureFromExcelPOSTController as ExpressBulkCreateLeagueSeasonFixtureFromExcelPOSTController).getExcelFileUploadMiddleware(),
    bulkCreateLeagueSeasonFixtureFromExcelPOSTController.run.bind(bulkCreateLeagueSeasonFixtureFromExcelPOSTController),
  );

  // Endpoint - Find all league season fixtures by league season id
  router.get(
    `${pathPrefix}/leagues/seasons/:leagueSeasonId/fixtures`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Find all league season fixtures by league season id',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    findAllLeagueSeasonFixturesByLeagueSeasonIdGETController.run.bind(findAllLeagueSeasonFixturesByLeagueSeasonIdGETController),
  );

  // Endpoint - Find league season fixture by id
  router.get(
    `${pathPrefix}/leagues/seasons/fixtures/:leagueSeasonFixtureId`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Find league season fixture by id',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    findLeagueSeasonFixtureByIdGETController.run.bind(findLeagueSeasonFixtureByIdGETController),
  );
};

export default register;
