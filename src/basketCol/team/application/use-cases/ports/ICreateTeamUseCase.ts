import { IUseCase } from '../../../../shared/application/use-cases/ports/IUseCase';
import { CreateTeamDTO } from '../../dtos/CreateTeamDTO';

export interface ICreateTeamUseCase extends IUseCase<CreateTeamDTO> {}
