export interface IController<Req, Res> {
  run(request: Req, response: Res): Promise<void>;
}
