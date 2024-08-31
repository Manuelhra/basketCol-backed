export interface IServerErrorHandle<Response> {
  run(response: Response, error: Error): void;
}
