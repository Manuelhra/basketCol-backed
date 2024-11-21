import { IUseCase } from '../../../../../shared/application/use-cases/ports/IUseCase';
import { CreateTeamPlayerDTO } from '../../dtos/CreateTeamPlayerDTO';

export interface ICreateTeamPlayerUseCase extends IUseCase<CreateTeamPlayerDTO> {}
