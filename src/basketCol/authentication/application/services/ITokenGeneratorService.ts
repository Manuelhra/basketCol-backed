import { IUserPrimitives, User } from '@basketcol/domain';

export interface ITokenGeneratorService {
  generateAuthenticationToken<IT extends IUserPrimitives, T extends User<IT>>(user: T): string;
}
