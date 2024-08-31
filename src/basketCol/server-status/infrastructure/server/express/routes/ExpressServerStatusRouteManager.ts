import { Router } from 'express';

import { IFileSystem } from '../../../../../shared/infrastructure/file-system/IFileSystem';
import { ExpressBaseRouteManager } from '../../../../../shared/infrastructure/server/express/routes/ExpressBaseRouteManager';
import { IRouteManager } from '../../../../../shared/infrastructure/server/routes/IRouteManager';

export class ExpressServerStatusRouteManager extends ExpressBaseRouteManager implements IRouteManager<Router> {
  public constructor(dependencies: {
    fileSystem: IFileSystem;
    basePath: string;
  }) {
    super(dependencies);
  }
}
