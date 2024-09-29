import { IFileSystem } from '../../../../../../shared/infrastructure/file-system/IFileSystem';
import { ExpressBaseRouteManager } from '../../../../../../shared/infrastructure/server/express/routes/ExpressBaseRouteManager';
import { IRouteManager } from '../../../../../../shared/infrastructure/server/routes/IRouteManager';

type Dependencies = {
  fileSystem: IFileSystem;
  basePath: string;
};

export class ExpressHostUserRouteManager extends ExpressBaseRouteManager implements IRouteManager {
  private constructor(dependencies: Dependencies) {
    super(dependencies);
  }

  public static create(dependencies: Dependencies): ExpressHostUserRouteManager {
    return new ExpressHostUserRouteManager(dependencies);
  }
}
