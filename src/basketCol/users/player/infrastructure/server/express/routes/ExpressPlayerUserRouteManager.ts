import { IFileSystem } from '../../../../../../shared/infrastructure/file-system/IFileSystem';
import { ExpressBaseRouteManager } from '../../../../../../shared/infrastructure/server/express/routes/ExpressBaseRouteManager';
import { IRouteManager } from '../../../../../../shared/infrastructure/server/routes/IRouteManager';

type Dependencies = {
  fileSystem: IFileSystem;
  basePath: string;
};

export class ExpressPlayerUserRouteManager extends ExpressBaseRouteManager implements IRouteManager {
  private constructor(dependencies: Dependencies) {
    super(dependencies);
  }

  public static create(dependencies: Dependencies): ExpressPlayerUserRouteManager {
    return new ExpressPlayerUserRouteManager(dependencies);
  }
}
