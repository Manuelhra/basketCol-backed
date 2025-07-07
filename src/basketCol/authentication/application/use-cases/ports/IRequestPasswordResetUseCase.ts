import { IUseCase } from '../../../../shared/application/use-cases/ports/IUseCase';
import { RequestPasswordResetDTO } from '../../dtos/RequestPasswordResetDTO';

export interface IRequestPasswordResetUseCase extends IUseCase<RequestPasswordResetDTO, void> {}
