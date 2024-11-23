import { Nullable, Team } from '@basketcol/domain';

import { IUseCase } from '../../../../shared/application/use-cases/ports/IUseCase';
import { FindTeamByIdDTO } from '../../dtos/FindTeamByIdDTO';

export interface IFindTeamByIdUseCase extends IUseCase<FindTeamByIdDTO, Nullable<Team>> {}
