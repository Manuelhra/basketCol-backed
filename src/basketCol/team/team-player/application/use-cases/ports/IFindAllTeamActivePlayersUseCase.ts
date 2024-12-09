import { PlayerUser, Team, TeamPlayer } from '@basketcol/domain';

import { IUseCase } from '../../../../../shared/application/use-cases/ports/IUseCase';
import { FindAllTeamActivePlayersDTO } from '../../dtos/FindAllTeamActivePlayersDTO';

export type IFindAllTeamActivePlayersUseCaseResponse = {
  teamPlayers: TeamPlayer[];
  playerUserList: PlayerUser[];
  teamInfo: Team;
};

export interface IFindAllTeamActivePlayersUseCase extends IUseCase<FindAllTeamActivePlayersDTO, IFindAllTeamActivePlayersUseCaseResponse> {}
