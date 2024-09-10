import { IUseCase } from '../../../../../shared/application/use-cases/ports/IUseCase';
import { CreateHostUserDTO } from '../../dtos/CreateHostUserDTO';

export interface ICreateHostUserUseCase extends IUseCase<CreateHostUserDTO> {}
