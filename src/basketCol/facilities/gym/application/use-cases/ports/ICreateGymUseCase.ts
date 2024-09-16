import { IUseCase } from '../../../../../shared/application/use-cases/ports/IUseCase';
import { CreateGymDTO } from '../../dtos/CreateGymDTO';

export interface ICreateGymUseCase extends IUseCase<CreateGymDTO> {}
