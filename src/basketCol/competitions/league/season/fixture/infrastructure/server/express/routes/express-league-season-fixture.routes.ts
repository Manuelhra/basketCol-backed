import { Router } from 'express';

import { expressAuthenticationMiddleware } from '../../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-authentication.middleware';
import { bulkCreateLeagueSeasonFixtureFromExcelPOSTController } from '../../../dependency-injection';
import { ExpressBulkCreateLeagueSeasonFixtureFromExcelPOSTController } from '../controllers/ExpressBulkCreateLeagueSeasonFixtureFromExcelPOSTController';
import { expressUserTypeAuthorizationMiddleware } from '../../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-user-type-authorization.middleware';
import { httpResponseHandler, tokenValidatorService } from '../../../../../../../../shared/infrastructure/dependency-injection';
import { expressServiceAvailabilityMiddleware } from '../../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-service-availability.middleware';

const register = (router: Router) => {
  const pathPrefix: string = '/competitions';

  // Endpoint - Bulk create league season fixtures from Excel
  router.post(
    `${pathPrefix}/league-season-fixtures/bulk-upload/excel`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Bulk create league season fixtures from Excel',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER'], httpResponseHandler),
    (bulkCreateLeagueSeasonFixtureFromExcelPOSTController as ExpressBulkCreateLeagueSeasonFixtureFromExcelPOSTController).getExcelFileUploadMiddleware(),
    bulkCreateLeagueSeasonFixtureFromExcelPOSTController.run.bind(bulkCreateLeagueSeasonFixtureFromExcelPOSTController),
  );
};

export default register;
