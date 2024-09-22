export interface IUserAuthenticationTokenPayload {
  userId: string;
  userEmail: { value: string; verified: boolean };
  userType: string;
}
