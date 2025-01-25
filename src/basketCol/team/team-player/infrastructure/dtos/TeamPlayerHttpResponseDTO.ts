import { AggregateRootHttpResponseDTO } from '../../../../shared/infrastructure/dtos/AggregateRootHttpResponseDTO';
import { PlayerUserCareerStatsHttpResponseDTO } from '../../../../users/player/career-stats/dtos/PlayerUserCareerStatsHttpResponseDTO';
import { PlayerUserHttpResponseDTO } from '../../../../users/player/infrastructure/dtos/PlayerUserHttpResponseDTO';
import { TeamHttpResponseDTO } from '../../../infrastructure/dtos/TeamHttpResponseDTO';

export interface TeamPlayerHttpResponseDTO extends AggregateRootHttpResponseDTO {
  team: TeamHttpResponseDTO;
  playerUser: PlayerUserHttpResponseDTO;
  playerUserCareerStats: PlayerUserCareerStatsHttpResponseDTO;
  status: string;
  jerseyNumber: number | null;
  position: string | null;
  joinedAt: string;
  leftAt: string | null;
}
