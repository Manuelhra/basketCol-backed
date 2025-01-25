import { PlayerUser, Team, TeamPlayer } from '@basketcol/domain';

import { IUseCase } from '../../../../../shared/application/use-cases/ports/IUseCase';
import { FindTeamActivePlayerDTO } from '../../dtos/FindTeamActivePlayerDTO';

export type IFindTeamActivePlayerUseCaseResponse = {
  teamPlayer: TeamPlayer;
  teamInfo: Team;
  playerUserInfo: PlayerUser;
} | null;

export interface IFindTeamActivePlayerUseCase extends IUseCase<FindTeamActivePlayerDTO, IFindTeamActivePlayerUseCaseResponse> {}
