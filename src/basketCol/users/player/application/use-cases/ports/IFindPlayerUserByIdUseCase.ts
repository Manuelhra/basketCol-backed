import { PlayerUser, PlayerUserCareerStats } from '@basketcol/domain';

import { IUseCase } from '../../../../../shared/application/use-cases/ports/IUseCase';
import { FindPlayerUserByIdDTO } from '../../dtos/FindPlayerUserByIdDTO';

export type IFindPlayerUserByIdUseCaseResponse = {
  playerUser: PlayerUser;
  playerUserCareerStats: PlayerUserCareerStats;
} | null;

export interface IFindPlayerUserByIdUseCase extends IUseCase<FindPlayerUserByIdDTO, IFindPlayerUserByIdUseCaseResponse> {}
