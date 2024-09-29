import { glob } from 'glob';

import { IFileSystem } from './IFileSystem';

type Dependencies = {
  basePath: string;
};

export class GlobFileSystem implements IFileSystem {
  readonly #basePath: string;

  private constructor(dependencies: Dependencies) {
    this.#basePath = `${dependencies.basePath}/../..`;
  }

  public static create(dependencies: Dependencies): GlobFileSystem {
    return new GlobFileSystem(dependencies);
  }

  public getFiles(pattern: string, options: object): string[] {
    return glob.sync(pattern, { ...options, cwd: this.#basePath });
  }

  public requireModule<Router>(path: string): { default: (router: Router) => void } {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(`${this.#basePath}/${path}`);
  }
}
