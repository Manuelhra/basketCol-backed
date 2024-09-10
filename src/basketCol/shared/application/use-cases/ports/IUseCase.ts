export interface IUseCase<DTO = void, Response = void> {
  execute(dto?: DTO): Promise<Response>;
}
