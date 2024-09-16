import { Router } from 'express';

import { hostUserPOSTController } from '../../../dependency-injection';

const register = (router: Router) => {
  router.post('host-user', hostUserPOSTController.run.bind(hostUserPOSTController));
};

export default register;
