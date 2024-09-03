export interface CreatePlayerUserDTO {
  id: string;
  name: { firstName: string; lastName: string; };
  biography: string;
  nickname: string;
  email: { value: string; };
  password: string;
}
