import { Router } from 'express';

import { createLeagueFounderUserPOSTController } from '../../../dependency-injection';
import { ExpressCreateLeagueFounderUserPOSTController } from '../controllers/ExpressCreateLeagueFounderUserPOSTController';
import { expressExtractDataFromBodyMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-extract-data-from-body.middleware';
import { httpResponseHandler, tokenValidatorService } from '../../../../../../shared/infrastructure/dependency-injection';
import { expressAuthenticationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-authentication.middleware';
import { expressUserTypeAuthorizationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-user-type-authorization.middleware';
import { createLeagueFounderUserPOSTControllerValidations } from './validations/create-league-founder-user-post-controller.validations';
import { expressInputValidationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-input-validation.middleware';

const register = (router: Router) => {
  const pathPrefix: string = '/users';

  // Endpoint - Create league founder user
  router.post(
    `${pathPrefix}/league-founders`,
    (createLeagueFounderUserPOSTController as ExpressCreateLeagueFounderUserPOSTController).getImageUploadMiddleware(),
    expressExtractDataFromBodyMiddleware(httpResponseHandler),
    expressAuthenticationMiddleware(tokenValidatorService, httpResponseHandler),
    expressUserTypeAuthorizationMiddleware(['HOST_USER'], httpResponseHandler),
    createLeagueFounderUserPOSTControllerValidations,
    expressInputValidationMiddleware,
    createLeagueFounderUserPOSTController.run.bind(createLeagueFounderUserPOSTController),
  );
};

export default register;
