import { Router } from 'express';

import { bulkCreateLeagueSeasonFixtureGameFromExcelPOSTController } from '../../../dependency-injection';
import { ExpressBulkCreateLeagueSeasonFixtureGameFromExcelPOSTController } from '../controllers/ExpressBulkCreateLeagueSeasonFixtureGameFromExcelPOSTController';
import { httpResponseHandler, tokenValidatorService } from '../../../../../../../../../shared/infrastructure/dependency-injection';
import { expressAuthenticationMiddleware } from '../../../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-authentication.middleware';
import { expressServiceAvailabilityMiddleware } from '../../../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-service-availability.middleware';
import { expressUserTypeAuthorizationMiddleware } from '../../../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-user-type-authorization.middleware';

const register = (router: Router) => {
  const pathPrefix: string = '/competitions';

  // Endpoint - Bulk create league season fixture games from Excel
  router.post(
    `${pathPrefix}/league-season-fixture-games/bulk-upload/excel`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Bulk create league season fixture games from Excel',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER'], httpResponseHandler),
    (bulkCreateLeagueSeasonFixtureGameFromExcelPOSTController as ExpressBulkCreateLeagueSeasonFixtureGameFromExcelPOSTController).getExcelFileUploadMiddleware(),
    bulkCreateLeagueSeasonFixtureGameFromExcelPOSTController.run.bind(bulkCreateLeagueSeasonFixtureGameFromExcelPOSTController),
  );
};

export default register;
