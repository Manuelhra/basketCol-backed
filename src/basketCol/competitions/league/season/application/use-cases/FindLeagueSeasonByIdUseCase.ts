import {
  ILeagueSeasonRepository,
  ILeagueRepository,
  LeagueSeasonId,
  LeagueSeason,
  League,
  LeagueSeasonLeagueId,
  LeagueNotFoundError,
  Nullable,
} from '@basketcol/domain';

import { IFindLeagueSeasonByIdUseCase, IFindLeagueSeasonByIdUseCaseResponse } from './ports/IFindLeagueSeasonByIdUseCase';
import { FindLeagueSeasonByIdDTO } from '../dtos/FindLeagueSeasonByIdDTO';

type Dependencies = {
  readonly leagueSeasonRepository: ILeagueSeasonRepository;
  readonly leagueRepository: ILeagueRepository;
};

export class FindLeagueSeasonByIdUseCase implements IFindLeagueSeasonByIdUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): FindLeagueSeasonByIdUseCase {
    return new FindLeagueSeasonByIdUseCase(dependencies);
  }

  public async execute(dto: FindLeagueSeasonByIdDTO): Promise<IFindLeagueSeasonByIdUseCaseResponse> {
    const leagueSeasonId: LeagueSeasonId = LeagueSeasonId.create(dto.id);

    const leagueSeasonFound: Nullable<LeagueSeason> = await this.dependencies.leagueSeasonRepository.findById(leagueSeasonId);

    if (leagueSeasonFound === null || leagueSeasonFound === undefined) {
      return null;
    }

    const leagueId: LeagueSeasonLeagueId = LeagueSeasonLeagueId.create(leagueSeasonFound.toPrimitives.leagueId);
    const leagueFound: Nullable<League> = await this.dependencies.leagueRepository.findById(leagueId);

    if (leagueFound === null || leagueFound === undefined) {
      throw LeagueNotFoundError.create(leagueId);
    }

    return {
      leagueSeason: leagueSeasonFound,
      league: leagueFound,
    };
  }
}
