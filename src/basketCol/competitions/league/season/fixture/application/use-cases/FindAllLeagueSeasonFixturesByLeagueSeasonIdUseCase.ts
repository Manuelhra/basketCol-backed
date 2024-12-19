import {
  ILeagueSeasonFixtureRepository,
  ILeagueSeasonRepository,
  LeagueSeason,
  LeagueSeasonFixture,
  LeagueSeasonNotFoundError,
  LSFixtureLeagueSeasonId,
  Nullable,
} from '@basketcol/domain';

import { IFindAllLeagueSeasonFixturesByLeagueSeasonIdUseCase, IFindAllLeagueSeasonFixturesByLeagueSeasonIdUseCaseResponse } from './ports/IFindAllLeagueSeasonFixturesByLeagueSeasonIdUseCase';
import { FindAllLeagueSeasonFixturesByLeagueSeasonIdDTO } from '../dtos/FindAllLeagueSeasonFixturesByLeagueSeasonIdDTO';

type Dependencies = {
  readonly leagueSeasonFixtureRepository: ILeagueSeasonFixtureRepository;
  readonly leagueSeasonRepository: ILeagueSeasonRepository;
};

export class FindAllLeagueSeasonFixturesByLeagueSeasonIdUseCase implements IFindAllLeagueSeasonFixturesByLeagueSeasonIdUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): FindAllLeagueSeasonFixturesByLeagueSeasonIdUseCase {
    return new FindAllLeagueSeasonFixturesByLeagueSeasonIdUseCase(dependencies);
  }

  public async execute(dto: FindAllLeagueSeasonFixturesByLeagueSeasonIdDTO): Promise<IFindAllLeagueSeasonFixturesByLeagueSeasonIdUseCaseResponse> {
    const leagueSeasonId: LSFixtureLeagueSeasonId = LSFixtureLeagueSeasonId.create(dto.leagueSeasonId);

    const leagueSeasonFound: Nullable<LeagueSeason> = await this.dependencies.leagueSeasonRepository.findById(leagueSeasonId);

    if (leagueSeasonFound === null || leagueSeasonFound === undefined) {
      throw LeagueSeasonNotFoundError.create(leagueSeasonId);
    }

    const leagueSeasonFixtures: LeagueSeasonFixture[] = await this.dependencies.leagueSeasonFixtureRepository.findAllByLeagueSeasonId(leagueSeasonId);

    return {
      leagueSeason: leagueSeasonFound,
      leagueSeasonFixtures,
    };
  }
}
