import { League, Nullable } from '@basketcol/domain';

import { IUseCase } from '../../../../../shared/application/use-cases/ports/IUseCase';
import { FindLeagueByIdDTO } from '../../dtos/FindLeagueByIdDTO';

export interface IFindLeagueByIdUseCase extends IUseCase<FindLeagueByIdDTO, Nullable<League>> {}
