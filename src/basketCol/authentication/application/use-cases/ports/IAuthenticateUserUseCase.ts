import { AnySystemUserType } from '@basketcol/domain';

import { AuthenticateUserDTO } from '../../dtos/AuthenticateUserDTO';
import { IUseCase } from '../../../../shared/application/use-cases/ports/IUseCase';

export interface IAuthenticateUserUseCase extends IUseCase<AuthenticateUserDTO, { authenticatedUser: AnySystemUserType; authenticationToken: string; }> {}
