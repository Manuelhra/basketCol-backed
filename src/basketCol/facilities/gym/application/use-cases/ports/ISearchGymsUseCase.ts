import { Gym, IPaginatedResponse } from '@basketcol/domain';

import { IUseCase } from '../../../../../shared/application/use-cases/ports/IUseCase';
import { SearchGymsDTO } from '../../dtos/SearchGymsDTO';

export interface ISearchGymsUseCase extends IUseCase<SearchGymsDTO, IPaginatedResponse<Gym>> {}
