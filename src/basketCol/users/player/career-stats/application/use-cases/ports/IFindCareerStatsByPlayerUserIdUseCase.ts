import { Nullable, PlayerUserCareerStats } from '@basketcol/domain';

import { IUseCase } from '../../../../../../shared/application/use-cases/ports/IUseCase';
import { FindCareerStatsByPlayerUserIdDTO } from '../../dtos/FindCareerStatsByPlayerUserIdDTO';

export interface IFindCareerStatsByPlayerUserIdUseCase
  extends IUseCase<FindCareerStatsByPlayerUserIdDTO, Nullable<PlayerUserCareerStats>> {}
