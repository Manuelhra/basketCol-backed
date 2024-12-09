import { StatsHttpResponseDTO } from '../../../../shared/infrastructure/dtos/StatsHttpResponseDTO';

export interface TeamAllTimeStatsHttpResponseDTO extends StatsHttpResponseDTO {
  teamId: string;
}
