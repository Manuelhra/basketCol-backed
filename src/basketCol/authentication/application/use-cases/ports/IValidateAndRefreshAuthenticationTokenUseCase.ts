import { IUseCase } from '../../../../shared/application/use-cases/ports/IUseCase';
import { ValidateAndRefreshAuthenticationTokenDTO } from '../../dtos/ValidateAndRefreshAuthenticationTokenDTO';

export interface IValidateAndRefreshAuthenticationTokenUseCase extends IUseCase<ValidateAndRefreshAuthenticationTokenDTO, { newAuthenticationToken: string; }> {}
