import { IUserContext } from '../../context/IUserContext';

export interface IUseCase<DTO = void, Response = void> {
  execute(dto?: DTO, userContext?: IUserContext): Promise<Response>;
}
