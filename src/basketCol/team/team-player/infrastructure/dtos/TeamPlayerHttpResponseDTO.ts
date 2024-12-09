import { AggregateRootHttpResponseDTO } from '../../../../shared/infrastructure/dtos/AggregateRootHttpResponseDTO';
import { PlayerUserHttpResponseDTO } from '../../../../users/player/infrastructure/dtos/PlayerUserHttpResponseDTO';
import { TeamHttpResponseDTO } from '../../../infrastructure/dtos/TeamHttpResponseDTO';

export interface TeamPlayerHttpResponseDTO extends AggregateRootHttpResponseDTO {
  team: TeamHttpResponseDTO;
  playerUser: PlayerUserHttpResponseDTO;
  status: string;
  jerseyNumber: number | null;
  position: string | null;
  joinedAt: string;
  leftAt: string | null;
}
