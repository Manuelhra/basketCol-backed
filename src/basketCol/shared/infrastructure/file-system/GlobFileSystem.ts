import { glob } from 'glob';

import { IFileSystem } from './IFileSystem';

export class GlobFileSystem implements IFileSystem {
  private basePath: string;

  constructor(dependencies: {
    basePath: string;
  }) {
    this.basePath = `${dependencies.basePath}/../..`;
  }

  public getFiles(pattern: string, options: object): string[] {
    return glob.sync(pattern, { ...options, cwd: this.basePath });
  }

  public requireModule<Router>(path: string): { default: (router: Router) => void } {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(`${this.basePath}/${path}`);
  }
}
