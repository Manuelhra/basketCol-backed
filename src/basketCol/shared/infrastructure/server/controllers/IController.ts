export interface IController {
  run(request: any, response: any): Promise<void>;
}
