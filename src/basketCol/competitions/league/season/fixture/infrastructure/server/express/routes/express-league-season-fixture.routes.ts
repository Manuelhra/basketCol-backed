import { Router } from 'express';

import { expressAuthenticationMiddleware } from '../../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-authentication.middleware';
import { bulkCreateLeagueSeasonFixtureFromExcelPOSTController } from '../../../dependency-injection';
import { ExpressBulkCreateLeagueSeasonFixtureFromExcelPOSTController } from '../controllers/ExpressBulkCreateLeagueSeasonFixtureFromExcelPOSTController';
import { expressUserTypeAuthorizationMiddleware } from '../../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-user-type-authorization.middleware';
import { httpResponseHandler, tokenValidatorService } from '../../../../../../../../shared/infrastructure/dependency-injection';

const register = (router: Router) => {
  const pathPrefix: string = '/competitions';

  // Endpoint - Bulk create league season fixtures from Excel
  router.post(
    `${pathPrefix}/league-season-fixtures/bulk-upload/excel`,
    (bulkCreateLeagueSeasonFixtureFromExcelPOSTController as ExpressBulkCreateLeagueSeasonFixtureFromExcelPOSTController).getExcelFileUploadMiddleware(),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER'], httpResponseHandler),
    bulkCreateLeagueSeasonFixtureFromExcelPOSTController.run.bind(bulkCreateLeagueSeasonFixtureFromExcelPOSTController),
  );
};

export default register;
