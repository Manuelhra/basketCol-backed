import { Request, Response } from 'express';

import { IController } from '../../controllers/IController';

export abstract class ExpressBaseController implements IController {
  public abstract run(request: Request, response: Response): Promise<void>;
}
