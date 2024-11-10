import { IPaginatedResponse, League } from '@basketcol/domain';

import { IUseCase } from '../../../../../shared/application/use-cases/ports/IUseCase';
import { SearchAllLeaguesDTO } from '../../dtos/SearchAllLeaguesDTO';

export interface ISearchAllLeaguesUseCase extends IUseCase<SearchAllLeaguesDTO, IPaginatedResponse<League>> {}
