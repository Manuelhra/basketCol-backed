import { IPaginatedResponse, League } from '@basketcol/domain';

import { IUseCase } from '../../../../../shared/application/use-cases/ports/IUseCase';
import { SearchLeaguesDTO } from '../../dtos/SearchLeaguesDTO';

export interface ISearchLeaguesUseCase extends IUseCase<SearchLeaguesDTO, IPaginatedResponse<League>> {}
