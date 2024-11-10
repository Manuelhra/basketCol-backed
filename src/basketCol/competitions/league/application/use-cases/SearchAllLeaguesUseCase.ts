import { ILeagueRepository, IPaginatedResponse, League } from '@basketcol/domain';

import { ISearchAllLeaguesUseCase } from './ports/ISearchAllLeaguesUseCase';
import { SearchAllLeaguesDTO } from '../dtos/SearchAllLeaguesDTO';

type Dependencies = {
  readonly leagueRepository: ILeagueRepository;
};

export class SearchAllLeaguesUseCase implements ISearchAllLeaguesUseCase {
  readonly #leagueRepository: ILeagueRepository;

  private constructor(dependencies: Dependencies) {
    this.#leagueRepository = dependencies.leagueRepository;
  }

  public static create(dependencies: Dependencies): SearchAllLeaguesUseCase {
    return new SearchAllLeaguesUseCase(dependencies);
  }

  public execute(dto: SearchAllLeaguesDTO): Promise<IPaginatedResponse<League>> {
    return this.#leagueRepository.searchAll(dto);
  }
}
