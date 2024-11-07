import { Court, ICourtRepository, IPaginatedResponse } from '@basketcol/domain';

import { SearchCourtsDTO } from '../dtos/SearchCourtsDTO';
import { ISearchCourtsUseCase } from './ports/ISearchCourtsUseCase';

type Dependencies = {
  readonly courtRepository: ICourtRepository;
};

export class SearchCourtsUseCase implements ISearchCourtsUseCase {
  readonly #courtRepository: ICourtRepository;

  private constructor(dependencies: Dependencies) {
    this.#courtRepository = dependencies.courtRepository;
  }

  public static create(dependencies: Dependencies): SearchCourtsUseCase {
    return new SearchCourtsUseCase(dependencies);
  }

  public execute(dto: SearchCourtsDTO): Promise<IPaginatedResponse<Court>> {
    return this.#courtRepository.searchAll(dto);
  }
}
