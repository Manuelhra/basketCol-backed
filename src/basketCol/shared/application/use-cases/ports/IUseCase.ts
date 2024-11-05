import { IUserContext } from '../../context/ports/IUserContext';

export interface IUseCase<DTO = void, Response = void> {
  execute(dto?: DTO, userContext?: IUserContext): Promise<Response>;
}
