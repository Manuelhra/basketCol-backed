import { Court, IPaginatedResponse } from '@basketcol/domain';

import { IUseCase } from '../../../../../shared/application/use-cases/ports/IUseCase';
import { SearchAllCourtsDTO } from '../../dtos/SearchAllCourtsDTO';

export interface ISearchAllCourtsUseCase extends IUseCase<SearchAllCourtsDTO, IPaginatedResponse<Court>> {}
