import { IUserContext } from '../../../application/context/ports/IUserContext';

declare global {
  namespace Express {
    interface Request {
      userContext?: IUserContext;
    }
  }
}
