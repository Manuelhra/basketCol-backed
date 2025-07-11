import { Router } from 'express';

import { createHostUserPOSTController } from '../../../dependency-injection';
import { createHostUserPOSTControllerValidations } from './validations/create-host-user-post-controller.validations';
import { expressInputValidationMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-input-validation.middleware';
import { ExpressCreateHostUserPOSTController } from '../controllers/ExpressCreateHostUserPOSTController';
import { httpResponseHandler } from '../../../../../../shared/infrastructure/dependency-injection';
import { expressExtractDataFromBodyMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-extract-data-from-body.middleware';
import { expressServiceAvailabilityMiddleware } from '../../../../../../shared/infrastructure/server/express/routes/middlewares/express-service-availability.middleware';

const register = (router: Router) => {
  const pathPrefix: string = '/users/host';

  // Endpoint - Create the host user for BasketCol
  router.post(
    `${pathPrefix}`,
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Create host user',
    }, httpResponseHandler),
    (createHostUserPOSTController as ExpressCreateHostUserPOSTController).getImageUploadMiddleware(),
    expressExtractDataFromBodyMiddleware(httpResponseHandler),
    createHostUserPOSTControllerValidations,
    expressInputValidationMiddleware,
    createHostUserPOSTController.run.bind(createHostUserPOSTController),
  );
};

export default register;
