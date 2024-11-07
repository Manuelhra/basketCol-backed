import { IPaginatedResponse, PlayerUser } from '@basketcol/domain';

import { IUseCase } from '../../../../../shared/application/use-cases/ports/IUseCase';
import { SearchPlayerUsersDTO } from '../../dtos/SearchPlayerUsersDTO';

export interface ISearchPlayerUsersUseCase extends IUseCase<SearchPlayerUsersDTO, IPaginatedResponse<PlayerUser>> {}
