import {
  ILeagueSeasonFixtureRepository,
  ILeagueSeasonRepository,
  LeagueSeason,
  LeagueSeasonFixture,
  LeagueSeasonNotFoundError,
  LSFixtureId,
  LSFixtureLeagueSeasonId,
  Nullable,
} from '@basketcol/domain';

import { IFindLeagueSeasonFixtureByIdUseCase, IFindLeagueSeasonFixtureByIdUseCaseResponse } from './ports/IFindLeagueSeasonFixtureByIdUseCase';
import { FindLeagueSeasonFixtureByIdDTO } from '../dtos/FindLeagueSeasonFixtureByIdDTO';

type Dependencies = {
  readonly leagueSeasonFixtureRepository: ILeagueSeasonFixtureRepository;
  readonly leagueSeasonRepository: ILeagueSeasonRepository;
};

export class FindLeagueSeasonFixtureByIdUseCase implements IFindLeagueSeasonFixtureByIdUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): FindLeagueSeasonFixtureByIdUseCase {
    return new FindLeagueSeasonFixtureByIdUseCase(dependencies);
  }

  public async execute(dto: FindLeagueSeasonFixtureByIdDTO): Promise<IFindLeagueSeasonFixtureByIdUseCaseResponse> {
    const leagueSeasonFixtureId: LSFixtureId = LSFixtureId.create(dto.id);
    const leagueSeasonFixtureFound: Nullable<LeagueSeasonFixture> = await this.dependencies.leagueSeasonFixtureRepository.findById(leagueSeasonFixtureId);

    if (leagueSeasonFixtureFound === null || leagueSeasonFixtureFound === undefined) return null;

    const leagueSeasonId: LSFixtureLeagueSeasonId = LSFixtureLeagueSeasonId.create(leagueSeasonFixtureFound.toPrimitives.leagueSeasonId);
    const leagueSeasonFound: Nullable<LeagueSeason> = await this.dependencies.leagueSeasonRepository.findById(leagueSeasonId);

    if (leagueSeasonFound === null || leagueSeasonFound === undefined) {
      throw LeagueSeasonNotFoundError.create(leagueSeasonId);
    }

    return {
      leagueSeasonFixture: leagueSeasonFixtureFound,
      leagueSeason: leagueSeasonFound,
    };
  }
}
