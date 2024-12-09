import { League, LeagueFounderUser } from '@basketcol/domain';

import { IUseCase } from '../../../../../shared/application/use-cases/ports/IUseCase';
import { FindLeagueByIdDTO } from '../../dtos/FindLeagueByIdDTO';

export type IFindLeagueByIdUseCaseResponse = {
  league: League;
  leagueFounderUser: LeagueFounderUser;
} | null;

export interface IFindLeagueByIdUseCase extends IUseCase<FindLeagueByIdDTO, IFindLeagueByIdUseCaseResponse> {}
