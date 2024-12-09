import { ILeagueSeasonRepository, LeagueSeason, LeagueSeasonLeagueId } from '@basketcol/domain';

import { IFindAllLeagueSeasonsByLeagueIdUseCase } from './ports/IFindAllLeagueSeasonsByLeagueIdUseCase';
import { FindAllLeagueSeasonsByLeagueIdDTO } from '../dtos/FindAllLeagueSeasonsByLeagueIdDTO';

type Dependencies = {
  readonly leagueSeasonRepository: ILeagueSeasonRepository;
};

export class FindAllLeagueSeasonsByLeagueIdUseCase implements IFindAllLeagueSeasonsByLeagueIdUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): FindAllLeagueSeasonsByLeagueIdUseCase {
    return new FindAllLeagueSeasonsByLeagueIdUseCase(dependencies);
  }

  public execute(dto: FindAllLeagueSeasonsByLeagueIdDTO): Promise<LeagueSeason[]> {
    const leagueSeasonLeagueId: LeagueSeasonLeagueId = LeagueSeasonLeagueId.create(dto.leagueId);
    return this.dependencies.leagueSeasonRepository.findAllByLeagueId(leagueSeasonLeagueId);
  }
}
