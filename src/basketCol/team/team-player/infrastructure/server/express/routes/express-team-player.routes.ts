import { Router } from 'express';

import { expressServiceAvailabilityMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-service-availability.middleware';
import { httpResponseHandler, tokenValidatorService } from '../../../../../../shared/infrastructure/dependency-injection';
import { expressAuthenticationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-authentication.middleware';
import { expressUserTypeAuthorizationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-user-type-authorization.middleware';
import { bulkCreateTeamPlayerFromExcelPOSTController, findAllTeamActivePlayersGETController } from '../../../dependency-injection';
import { ExpressBulkCreateTeamPlayerFromExcelPOSTController } from '../controllers/ExpressBulkCreateTeamPlayerFromExcelPOSTController';

const register = (router: Router) => {
  const pathPrefix: string = '/teams';

  // Endpoint - Bulk create team player from Excel
  router.post(
    `${pathPrefix}/players/bulk-upload/excel`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Bulk create team player from Excel',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER'], httpResponseHandler),
    (bulkCreateTeamPlayerFromExcelPOSTController as ExpressBulkCreateTeamPlayerFromExcelPOSTController).getExcelFileUploadMiddleware(),
    bulkCreateTeamPlayerFromExcelPOSTController.run.bind(bulkCreateTeamPlayerFromExcelPOSTController),
  );

  // Endpoint - Find all team active players
  router.get(
    `${pathPrefix}/:teamId/players/active`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Find all team active players',
    }, httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    findAllTeamActivePlayersGETController.run.bind(findAllTeamActivePlayersGETController),
  );
};

export default register;
