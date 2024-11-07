import { Gym, IGymRepository, IPaginatedResponse } from '@basketcol/domain';

import { SearchGymsDTO } from '../dtos/SearchGymsDTO';
import { ISearchGymsUseCase } from './ports/ISearchGymsUseCase';

type Dependencies = {
  readonly gymRepository: IGymRepository;
};

export class SearchGymsUseCase implements ISearchGymsUseCase {
  readonly #gymRepository: IGymRepository;

  private constructor(dependencies: Dependencies) {
    this.#gymRepository = dependencies.gymRepository;
  }

  public static create(dependencies: Dependencies): SearchGymsUseCase {
    return new SearchGymsUseCase(dependencies);
  }

  public execute(dto: SearchGymsDTO): Promise<IPaginatedResponse<Gym>> {
    return this.#gymRepository.searchAll(dto);
  }
}
