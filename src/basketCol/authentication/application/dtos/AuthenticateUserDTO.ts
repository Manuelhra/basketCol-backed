export interface AuthenticateUserDTO {
  nickname?: string;
  email?: string;
  password: string;
  userType: string;
}
