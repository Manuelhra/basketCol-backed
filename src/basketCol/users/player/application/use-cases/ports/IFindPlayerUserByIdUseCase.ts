import { Nullable, PlayerUser } from '@basketcol/domain';

import { IUseCase } from '../../../../../shared/application/use-cases/ports/IUseCase';
import { FindPlayerUserByIdDTO } from '../../dtos/FindPlayerUserByIdDTO';

export interface IFindPlayerUserByIdUseCase extends IUseCase<FindPlayerUserByIdDTO, Nullable<PlayerUser>> {}
