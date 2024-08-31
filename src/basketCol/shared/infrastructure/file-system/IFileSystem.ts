export interface IFileSystem {
  getFiles(pattern: string, options: object): string[];
  requireModule<Router>(path: string): { default: (router: Router) => void };
}
