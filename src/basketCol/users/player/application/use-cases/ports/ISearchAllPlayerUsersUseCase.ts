import { IPaginatedResponse, PlayerUser } from '@basketcol/domain';

import { IUseCase } from '../../../../../shared/application/use-cases/ports/IUseCase';
import { SearchAllPlayerUsersDTO } from '../../dtos/SearchAllPlayerUsersDTO';

export interface ISearchAllPlayerUsersUseCase extends IUseCase<SearchAllPlayerUsersDTO, IPaginatedResponse<PlayerUser>> {}
