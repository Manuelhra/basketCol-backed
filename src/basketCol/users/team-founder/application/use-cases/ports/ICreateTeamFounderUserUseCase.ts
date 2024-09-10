import { IUseCase } from '../../../../../shared/application/use-cases/ports/IUseCase';
import { CreateTeamFounderUserDTO } from '../../dtos/CreateTeamFounderUserDTO';

export interface ICreateTeamFounderUserUseCase extends IUseCase<CreateTeamFounderUserDTO> {}
