import { Router } from 'express';
import { serverStatusGETController } from '../../../dependency-injection';

const register = (router: Router) => {
  router.get('/server-status', serverStatusGETController.run.bind(serverStatusGETController));
};

export default register;
