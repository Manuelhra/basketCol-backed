import { IFileSystem } from '../../../../../../shared/infrastructure/file-system/IFileSystem';
import { ExpressBaseRouteManager } from '../../../../../../shared/infrastructure/server/express/routes/ExpressBaseRouteManager';
import { IRouteManager } from '../../../../../../shared/infrastructure/server/routes/IRouteManager';

export class ExpressPlayerUserRouteManager extends ExpressBaseRouteManager implements IRouteManager {
  public constructor(dependencies: {
    fileSystem: IFileSystem;
    basePath: string;
  }) {
    super(dependencies);
  }
}
