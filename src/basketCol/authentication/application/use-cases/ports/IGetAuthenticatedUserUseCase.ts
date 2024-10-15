import { AnySystemUserType } from '@basketcol/domain';

import { IUseCase } from '../../../../shared/application/use-cases/ports/IUseCase';
import { GetAuthenticatedUserDTO } from '../../dtos/GetAuthenticatedUserDTO';

export interface IGetAuthenticatedUserUseCase extends IUseCase<GetAuthenticatedUserDTO, { authenticatedUser: AnySystemUserType; }> {}
