import { Router } from 'express';

import { httpResponseHandler, tokenValidatorService } from '../../../../../../../../../../../shared/infrastructure/dependency-injection';
import { expressServiceAvailabilityMiddleware } from '../../../../../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-service-availability.middleware';
import { bulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController } from '../../../dependency-injection';
import { ExpressBulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController } from '../controllers/ExpressBulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController';
import { expressAuthenticationMiddleware } from '../../../../../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-authentication.middleware';
import { expressUserTypeAuthorizationMiddleware } from '../../../../../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-user-type-authorization.middleware';

const register = (router: Router) => {
  const pathPrefix: string = '/competitions/leagues/seasons';

  // Endpoint - Bulk create player league season fixture game box score from Excel
  router.post(
    `${pathPrefix}/fixtures/games/players/box-score/bulk-upload/excel`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Bulk create player league season fixture game box score from Excel',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER'], httpResponseHandler),
    (bulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController as ExpressBulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController).getExcelFileUploadMiddleware(),
    bulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController.run.bind(bulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController),
  );
};

export default register;
