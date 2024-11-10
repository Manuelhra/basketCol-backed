import { Router } from 'express';
import { serverStatusGETController } from '../../../dependency-injection';
import { expressServiceAvailabilityMiddleware } from '../../../../../shared/infrastructure/server/express/routes/middlewares/express-service-availability.middleware';
import { httpResponseHandler } from '../../../../../shared/infrastructure/dependency-injection';

const register = (router: Router) => {
  router.get(
    '/server-status',
    expressServiceAvailabilityMiddleware({
      isEnabled: true,
      serviceName: 'Server status',
    }, httpResponseHandler),
    serverStatusGETController.run.bind(serverStatusGETController),
  );
};

export default register;
