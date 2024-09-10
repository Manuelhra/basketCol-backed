import { IUseCase } from '../../../../../shared/application/use-cases/ports/IUseCase';
import { CreateRefereeUserDTO } from '../../dtos/CreateRefereeUserDTO';

export interface ICreateRefereeUserUseCase extends IUseCase<CreateRefereeUserDTO> {}
