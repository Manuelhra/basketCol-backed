import { Team, TeamAllTimeStats } from '@basketcol/domain';

import { IUseCase } from '../../../../shared/application/use-cases/ports/IUseCase';
import { FindTeamByIdDTO } from '../../dtos/FindTeamByIdDTO';

export type IFindTeamByIdUseCaseResponse = {
  team: Team;
  teamAllTimeStats: TeamAllTimeStats;
} | null;

export interface IFindTeamByIdUseCase extends IUseCase<FindTeamByIdDTO, IFindTeamByIdUseCaseResponse> {}
