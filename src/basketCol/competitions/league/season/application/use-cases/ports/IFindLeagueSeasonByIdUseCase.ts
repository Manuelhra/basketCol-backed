import { League, LeagueSeason } from '@basketcol/domain';

import { IUseCase } from '../../../../../../shared/application/use-cases/ports/IUseCase';
import { FindLeagueSeasonByIdDTO } from '../../dtos/FindLeagueSeasonByIdDTO';

export type IFindLeagueSeasonByIdUseCaseResponse = {
  leagueSeason: LeagueSeason;
  league: League;
} | null;

export interface IFindLeagueSeasonByIdUseCase extends IUseCase<FindLeagueSeasonByIdDTO, IFindLeagueSeasonByIdUseCaseResponse> {}
