import {
  FixtureId,
  ILeagueSeasonFixtureGameRepository,
  ITeamRepository,
  LSFGameFixtureId,
  Team,
  TeamId,
} from '@basketcol/domain';

import {
  FindAllLeagueSeasonFixtureGamesByFixtureIdUseCaseResponse,
  IFindAllLeagueSeasonFixtureGamesByFixtureIdUseCase,
} from './ports/IFindAllLeagueSeasonFixtureGamesByFixtureIdUseCase';
import { FindAllLeagueSeasonFixtureGamesByFixtureIdDTO } from '../dtos/FindAllLeagueSeasonFixtureGamesByFixtureIdDTO';

type Dependencies = {
  readonly leagueSeasonFixtureGameRepository: ILeagueSeasonFixtureGameRepository;
  readonly teamRepository: ITeamRepository;
};

export class FindAllLeagueSeasonFixtureGamesByFixtureIdUseCase
implements IFindAllLeagueSeasonFixtureGamesByFixtureIdUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): FindAllLeagueSeasonFixtureGamesByFixtureIdUseCase {
    return new FindAllLeagueSeasonFixtureGamesByFixtureIdUseCase(dependencies);
  }

  public async execute(
    dto: FindAllLeagueSeasonFixtureGamesByFixtureIdDTO,
  ): Promise<FindAllLeagueSeasonFixtureGamesByFixtureIdUseCaseResponse> {
    const fixtureId: FixtureId = LSFGameFixtureId.create(dto.fixtureId);

    const leagueSeasonFixtureGames = await this.dependencies
      .leagueSeasonFixtureGameRepository
      .findAllByFixtureId(fixtureId);

    const teamListString: string[] = [...new Set([
      ...leagueSeasonFixtureGames.map((game) => game.toPrimitives.homeTeamId),
      ...leagueSeasonFixtureGames.map((game) => game.toPrimitives.awayTeamId),
    ])];

    const teamList: Team[] = (
      await Promise.all(
        teamListString.map((teamIdString) => this.dependencies.teamRepository.findById(TeamId.create(teamIdString))),
      )
    ).filter((team): team is Team => team !== undefined);

    return {
      leagueSeasonFixtureGames,
      teamList,
    };
  }
}
