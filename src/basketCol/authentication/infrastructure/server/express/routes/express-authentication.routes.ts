import { Router } from 'express';
import { authenticateUserPOSTController } from '../../../dependency-injection';

const register = (router: Router) => {
  router.post('/authentication/tokens', authenticateUserPOSTController.run.bind(authenticateUserPOSTController));
};

export default register;
