export interface CreateTeamPlayerDTO {
  id: string;
  teamId: string;
  playerUserId: string;
  jerseyNumber: number | null;
  position: string | null;
}
