import { Router } from 'express';
import { expressHostUserPostController } from '../../../dependency-injection';

const register = (router: Router) => {
  router.post('host-user', expressHostUserPostController.run.bind(expressHostUserPostController));
};

export default register;
