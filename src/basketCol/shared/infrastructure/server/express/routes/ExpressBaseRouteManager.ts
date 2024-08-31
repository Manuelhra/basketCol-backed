import { Router } from 'express';

import { IFileSystem } from '../../../file-system/IFileSystem';

export abstract class ExpressBaseRouteManager {
  readonly #fileSystem: IFileSystem;

  protected constructor(dependencies: {
    fileSystem: IFileSystem;
    basePath: string;
  }) {
    this.#fileSystem = dependencies.fileSystem;
  }

  public registerRoutes(router: Router): void {
    const routes: string[] = this.#fileSystem.getFiles('**/*.route.*', {});
    routes.forEach((route) => this.registerRoute(route, router));
  }

  private registerRoute(routePath: string, router: Router): void {
    const module = this.#fileSystem.requireModule(routePath);
    module.default(router);
  }
}
