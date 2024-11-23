import { TeamPlayer } from '@basketcol/domain';

import { IUseCase } from '../../../../../shared/application/use-cases/ports/IUseCase';
import { FindAllTeamActivePlayersDTO } from '../../dtos/FindAllTeamActivePlayersDTO';

export interface IFindAllTeamActivePlayersUseCase extends IUseCase<FindAllTeamActivePlayersDTO, TeamPlayer[]> {}
