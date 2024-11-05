import { Router } from 'express';

import { ExpressBulkCreatePlayerUserAttributeCategoriesFromExcelPOSTController } from '../controllers/ExpressBulkCreatePlayerUserAttributeCategoriesFromExcelPOSTController';
import { bulkCreatePlayerUserAttributeCategoriesFromExcelPOSTController, getPlayerUserAttributeCategoriesGETController } from '../../../dependency-injection';
import { expressAuthenticationMiddleware } from '../../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-authentication.middleware';
import { httpResponseHandler, tokenValidatorService } from '../../../../../../../../shared/infrastructure/dependency-injection';
import { expressUserTypeAuthorizationMiddleware } from '../../../../../../../../shared/infrastructure/server/express/routes/middlewares/express-user-type-authorization.middleware';

const register = (router: Router) => {
  const pathPrefix: string = '/users/players';

  // Endpoint - Bulk create player user attribute categories from Excel
  router.post(
    `${pathPrefix}/attribute-categories/bulk-upload/excel`,
    (bulkCreatePlayerUserAttributeCategoriesFromExcelPOSTController as ExpressBulkCreatePlayerUserAttributeCategoriesFromExcelPOSTController).getExcelFileUploadMiddleware(),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER'], httpResponseHandler),
    bulkCreatePlayerUserAttributeCategoriesFromExcelPOSTController.run.bind(bulkCreatePlayerUserAttributeCategoriesFromExcelPOSTController),
  );

  // Endpoint - Get player user attribute categories
  router.get(
    `${pathPrefix}/:playerUserId/attribute-categories`,
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER', 'PLAYER_USER'], httpResponseHandler),
    getPlayerUserAttributeCategoriesGETController.run.bind(getPlayerUserAttributeCategoriesGETController),
  );
};

export default register;
