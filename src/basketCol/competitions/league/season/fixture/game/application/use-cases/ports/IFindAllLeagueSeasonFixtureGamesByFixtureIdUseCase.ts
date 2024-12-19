import { LeagueSeasonFixtureGame, Team } from '@basketcol/domain';

import { IUseCase } from '../../../../../../../../shared/application/use-cases/ports/IUseCase';
import { FindAllLeagueSeasonFixtureGamesByFixtureIdDTO } from '../../dtos/FindAllLeagueSeasonFixtureGamesByFixtureIdDTO';

export type FindAllLeagueSeasonFixtureGamesByFixtureIdUseCaseResponse = {
  leagueSeasonFixtureGames: LeagueSeasonFixtureGame[];
  teamList: Team[];
};

export interface IFindAllLeagueSeasonFixtureGamesByFixtureIdUseCase extends IUseCase<FindAllLeagueSeasonFixtureGamesByFixtureIdDTO, FindAllLeagueSeasonFixtureGamesByFixtureIdUseCaseResponse> {}
