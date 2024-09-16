export interface IServerErrorHandler {
  run(response: any, error: Error): void;
}
