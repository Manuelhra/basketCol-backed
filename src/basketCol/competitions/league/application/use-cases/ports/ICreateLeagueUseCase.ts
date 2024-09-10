import { IUseCase } from '../../../../../shared/application/use-cases/ports/IUseCase';
import { CreateLeagueDTO } from '../../dtos/CreateLeagueDTO';

export interface ICreateLeagueUseCase extends IUseCase<CreateLeagueDTO> {}
