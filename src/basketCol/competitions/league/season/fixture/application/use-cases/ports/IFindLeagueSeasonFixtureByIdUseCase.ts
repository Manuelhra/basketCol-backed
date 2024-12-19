import { LeagueSeason, LeagueSeasonFixture } from '@basketcol/domain';

import { IUseCase } from '../../../../../../../shared/application/use-cases/ports/IUseCase';
import { FindLeagueSeasonFixtureByIdDTO } from '../../dtos/FindLeagueSeasonFixtureByIdDTO';

export type IFindLeagueSeasonFixtureByIdUseCaseResponse = {
  leagueSeasonFixture: LeagueSeasonFixture;
  leagueSeason: LeagueSeason;
} | null;

export interface IFindLeagueSeasonFixtureByIdUseCase extends IUseCase<FindLeagueSeasonFixtureByIdDTO, IFindLeagueSeasonFixtureByIdUseCaseResponse> {}
