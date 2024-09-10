import { IUseCase } from '../../../../../shared/application/use-cases/ports/IUseCase';
import { CreatePlayerUserDTO } from '../../dtos/CreatePlayerUserDTO';

export interface ICreatePlayerUserUseCase extends IUseCase<CreatePlayerUserDTO> {}
