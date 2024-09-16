import { IUseCase } from '../../../../../shared/application/use-cases/ports/IUseCase';
import { CreateCourtDTO } from '../../dtos/CreateCourtDTO';

export interface ICreateCourtUseCase extends IUseCase<CreateCourtDTO> {}
