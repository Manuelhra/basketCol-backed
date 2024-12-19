import {
  LeagueSeason,
  LeagueSeasonAwards,
  PlayerUser,
  Team,
} from '@basketcol/domain';

import { IUseCase } from '../../../../../../../shared/application/use-cases/ports/IUseCase';
import { FindLeagueSeasonAwardsByLeagueSeasonIdDTO } from '../../dtos/FindLeagueSeasonAwardsByLeagueSeasonIdDTO';

export type IFindLeagueSeasonAwardsByLeagueSeasonIdUseCaseResponse = {
  leagueSeasonAwards: LeagueSeasonAwards;
  playerUserList: PlayerUser[];
  leagueSeason: LeagueSeason;
  championTeam: Team;
} | null;

export interface IFindLeagueSeasonAwardsByLeagueSeasonIdUseCase extends IUseCase<FindLeagueSeasonAwardsByLeagueSeasonIdDTO, IFindLeagueSeasonAwardsByLeagueSeasonIdUseCaseResponse> {}
