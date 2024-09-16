import { IUseCase } from '../../../../../../shared/application/use-cases/ports/IUseCase';
import { CreateLeagueSeasonDTO } from '../../dtos/CreateLeagueSeasonDTO';

export interface ICreateLeagueSeasonUseCase extends IUseCase<CreateLeagueSeasonDTO> {}
