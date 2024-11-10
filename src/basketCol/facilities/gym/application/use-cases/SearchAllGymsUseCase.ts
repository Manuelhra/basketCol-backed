import { Gym, IGymRepository, IPaginatedResponse } from '@basketcol/domain';

import { SearchAllGymsDTO } from '../dtos/SearchAllGymsDTO';
import { ISearchAllGymsUseCase } from './ports/ISearchAllGymsUseCase';

type Dependencies = {
  readonly gymRepository: IGymRepository;
};

export class SearchAllGymsUseCase implements ISearchAllGymsUseCase {
  readonly #gymRepository: IGymRepository;

  private constructor(dependencies: Dependencies) {
    this.#gymRepository = dependencies.gymRepository;
  }

  public static create(dependencies: Dependencies): SearchAllGymsUseCase {
    return new SearchAllGymsUseCase(dependencies);
  }

  public execute(dto: SearchAllGymsDTO): Promise<IPaginatedResponse<Gym>> {
    return this.#gymRepository.searchAll(dto);
  }
}
