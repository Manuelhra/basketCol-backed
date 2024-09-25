import { IUserContext } from '../../../application/context/IUserContext';

declare global {
  namespace Express {
    interface Request {
      userContext?: IUserContext;
    }
  }
}
