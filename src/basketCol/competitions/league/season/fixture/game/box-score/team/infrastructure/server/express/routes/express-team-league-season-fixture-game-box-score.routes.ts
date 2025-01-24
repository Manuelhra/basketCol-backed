import { Router } from 'express';

import { expressAuthenticationMiddleware } from '../../../../../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-authentication.middleware';
import { httpResponseHandler, tokenValidatorService } from '../../../../../../../../../../../shared/infrastructure/dependency-injection';
import { bulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController } from '../../../dependency-injection';
import { expressUserTypeAuthorizationMiddleware } from '../../../../../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-user-type-authorization.middleware';
import { expressServiceAvailabilityMiddleware } from '../../../../../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-service-availability.middleware';
import { ExpressBulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController } from '../controllers/ExpressBulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController';

const register = (router: Router) => {
  const pathPrefix: string = '/competitions/leagues/seasons';

  // Endpoint - create team league season fixture game box score from Excel
  router.post(
    `${pathPrefix}/fixtures/games/teams/box-score/bulk-upload/excel`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Bulk create team league season fixture game box score from Excel',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER'], httpResponseHandler),
    (bulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController as ExpressBulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController).getExcelFileUploadMiddleware(),
    bulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController.run.bind(bulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelPOSTController),
  );
};

export default register;
