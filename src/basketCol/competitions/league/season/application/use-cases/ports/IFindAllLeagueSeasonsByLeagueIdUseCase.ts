import { LeagueSeason } from '@basketcol/domain';

import { IUseCase } from '../../../../../../shared/application/use-cases/ports/IUseCase';
import { FindAllLeagueSeasonsByLeagueIdDTO } from '../../dtos/FindAllLeagueSeasonsByLeagueIdDTO';

export interface IFindAllLeagueSeasonsByLeagueIdUseCase extends IUseCase<FindAllLeagueSeasonsByLeagueIdDTO, LeagueSeason[]> {}
