export interface AuthenticateUserDTO {
  nickname?: string;
  email?: string;
  password: string;
  type: string;
}
