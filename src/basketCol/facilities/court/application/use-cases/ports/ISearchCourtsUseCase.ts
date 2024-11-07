import { Court, IPaginatedResponse } from '@basketcol/domain';

import { IUseCase } from '../../../../../shared/application/use-cases/ports/IUseCase';
import { SearchCourtsDTO } from '../../dtos/SearchCourtsDTO';

export interface ISearchCourtsUseCase extends IUseCase<SearchCourtsDTO, IPaginatedResponse<Court>> {}
