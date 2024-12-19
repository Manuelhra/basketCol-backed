import { LeagueSeason, LeagueSeasonFixture } from '@basketcol/domain';

import { IUseCase } from '../../../../../../../shared/application/use-cases/ports/IUseCase';
import { FindAllLeagueSeasonFixturesByLeagueSeasonIdDTO } from '../../dtos/FindAllLeagueSeasonFixturesByLeagueSeasonIdDTO';

export type IFindAllLeagueSeasonFixturesByLeagueSeasonIdUseCaseResponse = {
  leagueSeasonFixtures: LeagueSeasonFixture[];
  leagueSeason: LeagueSeason;
} | null;

export interface IFindAllLeagueSeasonFixturesByLeagueSeasonIdUseCase extends IUseCase<FindAllLeagueSeasonFixturesByLeagueSeasonIdDTO, IFindAllLeagueSeasonFixturesByLeagueSeasonIdUseCaseResponse> {}
