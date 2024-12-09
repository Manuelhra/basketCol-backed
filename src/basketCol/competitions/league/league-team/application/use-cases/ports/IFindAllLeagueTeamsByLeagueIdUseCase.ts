import { League, LeagueTeam, Team } from '@basketcol/domain';

import { IUseCase } from '../../../../../../shared/application/use-cases/ports/IUseCase';
import { FindAllLeagueTeamsByLeagueIdDTO } from '../../dtos/FindAllLeagueTeamsByLeagueIdDTO';

export interface IFindAllLeagueTeamsByLeagueIdUseCaseResponse {
  leagueTeams: LeagueTeam[];
  teamList: Team[];
  leagueInfo: League;
}

export interface IFindAllLeagueTeamsByLeagueIdUseCase extends IUseCase<FindAllLeagueTeamsByLeagueIdDTO, IFindAllLeagueTeamsByLeagueIdUseCaseResponse> {}
