import { IUseCase } from '../../../../../../../shared/application/use-cases/ports/IUseCase';
import { CreateLeagueSeasonAwardsDTO } from '../../dtos/CreateLeagueSeasonAwardsDTO';

export interface ICreateLeagueSeasonAwardsUseCase extends IUseCase<CreateLeagueSeasonAwardsDTO> {}
