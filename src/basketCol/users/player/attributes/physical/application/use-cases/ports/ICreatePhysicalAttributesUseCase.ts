import { IUseCase } from '../../../../../../../shared/application/use-cases/ports/IUseCase';
import { CreatePhysicalAttributesDTO } from '../../dtos/CreatePhysicalAttributesDTO';

export interface ICreatePhysicalAttributesUseCase extends IUseCase<CreatePhysicalAttributesDTO> {}
