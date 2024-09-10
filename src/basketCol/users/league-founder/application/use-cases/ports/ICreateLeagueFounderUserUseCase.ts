import { IUseCase } from '../../../../../shared/application/use-cases/ports/IUseCase';
import { CreateLeagueFounderUserDTO } from '../../dtos/CreateLeagueFounderUserDTO';

export interface ICreateLeagueFounderUserUseCase extends IUseCase<CreateLeagueFounderUserDTO> {}
