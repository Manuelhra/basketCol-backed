import { AggregateRootHttpResponseDTO } from '../../../../shared/infrastructure/dtos/AggregateRootHttpResponseDTO';
import { StatsHttpResponseDTO } from '../../../../shared/infrastructure/dtos/StatsHttpResponseDTO';

export interface PlayerUserCareerStatsHttpResponseDTO
  extends AggregateRootHttpResponseDTO,
  StatsHttpResponseDTO {
  playerUserId: string;
}
