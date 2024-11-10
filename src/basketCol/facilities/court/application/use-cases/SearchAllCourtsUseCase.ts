import { Court, ICourtRepository, IPaginatedResponse } from '@basketcol/domain';

import { SearchAllCourtsDTO } from '../dtos/SearchAllCourtsDTO';
import { ISearchAllCourtsUseCase } from './ports/ISearchAllCourtsUseCase';

type Dependencies = {
  readonly courtRepository: ICourtRepository;
};

export class SearchAllCourtsUseCase implements ISearchAllCourtsUseCase {
  readonly #courtRepository: ICourtRepository;

  private constructor(dependencies: Dependencies) {
    this.#courtRepository = dependencies.courtRepository;
  }

  public static create(dependencies: Dependencies): SearchAllCourtsUseCase {
    return new SearchAllCourtsUseCase(dependencies);
  }

  public execute(dto: SearchAllCourtsDTO): Promise<IPaginatedResponse<Court>> {
    return this.#courtRepository.searchAll(dto);
  }
}
