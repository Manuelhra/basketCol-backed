import { IUser, User } from '@basketcol/domain';

export interface ITokenGeneratorService {
  generateAuthenticationToken<IT extends IUser, T extends User<IT>>(user: T): string;
}
