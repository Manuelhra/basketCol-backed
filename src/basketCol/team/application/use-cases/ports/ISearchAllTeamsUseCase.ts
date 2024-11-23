import { IPaginatedResponse, Team } from '@basketcol/domain';

import { IUseCase } from '../../../../shared/application/use-cases/ports/IUseCase';
import { SearchAllTeamsDTO } from '../../dtos/SearchAllTeamsDTO';

export interface ISearchAllTeamsUseCase extends IUseCase<SearchAllTeamsDTO, IPaginatedResponse<Team>> {}
