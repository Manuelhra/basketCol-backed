import { IPaginatedResponse, ITeamRepository, Team } from '@basketcol/domain';

import { ISearchAllTeamsUseCase } from './ports/ISearchAllTeamsUseCase';
import { SearchAllTeamsDTO } from '../dtos/SearchAllTeamsDTO';

type Dependencies = {
  readonly teamRepository: ITeamRepository;
};

export class SearchAllTeamsUseCase implements ISearchAllTeamsUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): SearchAllTeamsUseCase {
    return new SearchAllTeamsUseCase(dependencies);
  }

  public execute(dto: SearchAllTeamsDTO): Promise<IPaginatedResponse<Team>> {
    return this.dependencies.teamRepository.searchAll(dto);
  }
}
