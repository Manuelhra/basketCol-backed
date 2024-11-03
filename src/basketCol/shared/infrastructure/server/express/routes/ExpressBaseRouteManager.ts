import { Router } from 'express';

import { IFileSystem } from '../../../file-system/IFileSystem';

type Dependencies = {
  fileSystem: IFileSystem;
};

export abstract class ExpressBaseRouteManager {
  readonly #fileSystem: IFileSystem;

  protected constructor(dependencies: Dependencies) {
    this.#fileSystem = dependencies.fileSystem;
  }

  public registerRoutes(router: Router): void {
    const routes: string[] = this.#fileSystem.getFiles('**/*.routes.*', {});
    routes.forEach((route) => this.#registerRoute(route, router));
  }

  #registerRoute(routePath: string, router: Router): void {
    const module = this.#fileSystem.requireModule(routePath);
    module.default(router);
  }
}
