import { Router } from 'express';
import { expressServerStatusGetController } from '../../../dependency-injection';

const register = (router: Router) => {
  router.get('/server-status', expressServerStatusGetController.run.bind(expressServerStatusGetController));
};

export default register;
