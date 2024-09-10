import {
  HostUser,
  LeagueFounderUser,
  PlayerUser,
  RefereeUser,
  TeamFounderUser,
} from '@basketcol/domain';

import { AuthenticateUserDTO } from '../../dtos/AuthenticateUserDTO';
import { IUseCase } from '../../../../shared/application/use-cases/ports/IUseCase';

export type SomethingUser = HostUser | PlayerUser | RefereeUser | TeamFounderUser | LeagueFounderUser;

export interface IAuthenticateUserUseCase extends IUseCase<AuthenticateUserDTO, { user: SomethingUser; authenticationToken: string; }> {}
