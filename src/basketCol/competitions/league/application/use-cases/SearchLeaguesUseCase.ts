import { ILeagueRepository, IPaginatedResponse, League } from '@basketcol/domain';

import { ISearchLeaguesUseCase } from './ports/ISearchLeaguesUseCase';
import { SearchLeaguesDTO } from '../dtos/SearchLeaguesDTO';

type Dependencies = {
  readonly leagueRepository: ILeagueRepository;
};

export class SearchLeaguesUseCase implements ISearchLeaguesUseCase {
  readonly #leagueRepository: ILeagueRepository;

  private constructor(dependencies: Dependencies) {
    this.#leagueRepository = dependencies.leagueRepository;
  }

  public static create(dependencies: Dependencies): SearchLeaguesUseCase {
    return new SearchLeaguesUseCase(dependencies);
  }

  public execute(dto: SearchLeaguesDTO): Promise<IPaginatedResponse<League>> {
    return this.#leagueRepository.searchAll(dto);
  }
}
