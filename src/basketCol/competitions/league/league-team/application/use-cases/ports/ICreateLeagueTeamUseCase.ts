import { IUseCase } from '../../../../../../shared/application/use-cases/ports/IUseCase';
import { CreateLeagueTeamDTO } from '../../dtos/CreateLeagueTeamDTO';

export interface ICreateLeagueTeamUseCase extends IUseCase<CreateLeagueTeamDTO> {}
