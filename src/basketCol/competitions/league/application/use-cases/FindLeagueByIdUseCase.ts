import {
  ILeagueFounderUserRepository,
  ILeagueRepository,
  League,
  LeagueFounderUser,
  LeagueFounderUserId,
  LeagueId,
  Nullable,
} from '@basketcol/domain';

import { IFindLeagueByIdUseCase, IFindLeagueByIdUseCaseResponse } from './ports/IFindLeagueByIdUseCase';
import { FindLeagueByIdDTO } from '../dtos/FindLeagueByIdDTO';
import { FounderNotFoundForLeagueError } from '../exceptions/FounderNotFoundForLeagueError';

type Dependencies = {
  readonly leagueRepository: ILeagueRepository;
  readonly leagueFounderUserRepository: ILeagueFounderUserRepository;
};

export class FindLeagueByIdUseCase implements IFindLeagueByIdUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): FindLeagueByIdUseCase {
    return new FindLeagueByIdUseCase(dependencies);
  }

  public async execute(dto: FindLeagueByIdDTO): Promise<IFindLeagueByIdUseCaseResponse> {
    const leagueId: LeagueId = LeagueId.create(dto.id);
    const leagueFound: Nullable<League> = await this.dependencies.leagueRepository.findById(leagueId);

    if (leagueFound === null || leagueFound === undefined) {
      return null;
    }

    const leagueFounderUserId: LeagueFounderUserId = LeagueFounderUserId.create(leagueFound.toPrimitives.leagueFounderUserId);
    const leagueFounderUserFound: Nullable<LeagueFounderUser> = await this.dependencies.leagueFounderUserRepository.findById(leagueFounderUserId);

    if (leagueFounderUserFound === null || leagueFounderUserFound === undefined) {
      throw FounderNotFoundForLeagueError.create(`Founder not found for league with ID ${leagueId.value}`);
    }

    return {
      league: leagueFound,
      leagueFounderUser: leagueFounderUserFound,
    };
  }
}
