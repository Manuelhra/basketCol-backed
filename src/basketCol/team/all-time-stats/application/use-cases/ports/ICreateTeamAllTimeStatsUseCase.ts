import { IUseCase } from '../../../../../shared/application/use-cases/ports/IUseCase';
import { CreateTeamAllTimeStatsDTO } from '../../dtos/CreateTeamAllTimeStatsDTO';

export interface ICreateTeamAllTimeStatsUseCase extends IUseCase<CreateTeamAllTimeStatsDTO> {}
