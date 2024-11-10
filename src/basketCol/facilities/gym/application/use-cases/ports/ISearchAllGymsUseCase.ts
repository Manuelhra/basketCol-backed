import { Gym, IPaginatedResponse } from '@basketcol/domain';

import { IUseCase } from '../../../../../shared/application/use-cases/ports/IUseCase';
import { SearchAllGymsDTO } from '../../dtos/SearchAllGymsDTO';

export interface ISearchAllGymsUseCase extends IUseCase<SearchAllGymsDTO, IPaginatedResponse<Gym>> {}
