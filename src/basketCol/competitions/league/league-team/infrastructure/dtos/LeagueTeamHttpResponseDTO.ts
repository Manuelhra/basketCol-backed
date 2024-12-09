import { AggregateRootHttpResponseDTO } from '../../../../../shared/infrastructure/dtos/AggregateRootHttpResponseDTO';
import { TeamHttpResponseDTO } from '../../../../../team/infrastructure/dtos/TeamHttpResponseDTO';
import { LeagueHttpResponseDTO } from '../../../infrastructure/dtos/LeagueHttpResponseDTO';

export interface LeagueTeamHttpResponseDTO extends AggregateRootHttpResponseDTO {
  teamId: string;
  leagueId: string;
  status: string;
  joinedAt: string;
  leftAt: string | null;
  divisionLevel: string | null; // Para ligas con múltiples divisiones
  lastPromotionDate: string | null;
  lastRelegationDate: string | null;
  team: TeamHttpResponseDTO;
  league: LeagueHttpResponseDTO;
}
