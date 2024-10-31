export interface CreateTeamFounderUserDTO {
  id: string;
  name: { firstName: string; lastName: string; };
  biography: string;
  email: { value: string; };
  password: string;
  profileImage: { url: string; updatedAt: string; };
}
