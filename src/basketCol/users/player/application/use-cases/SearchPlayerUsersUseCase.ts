import { IPaginatedResponse, IPlayerUserRepository, PlayerUser } from '@basketcol/domain';

import { SearchPlayerUsersDTO } from '../dtos/SearchPlayerUsersDTO';
import { ISearchPlayerUsersUseCase } from './ports/ISearchPlayerUsersUseCase';

type Dependencies = {
  readonly playerUserRepository: IPlayerUserRepository;
};

export class SearchPlayerUsersUseCase implements ISearchPlayerUsersUseCase {
  readonly #playerUserRepository: IPlayerUserRepository;

  private constructor(dependencies: Dependencies) {
    this.#playerUserRepository = dependencies.playerUserRepository;
  }

  public static create(dependencies: Dependencies): SearchPlayerUsersUseCase {
    return new SearchPlayerUsersUseCase(dependencies);
  }

  public execute(dto: SearchPlayerUsersDTO): Promise<IPaginatedResponse<PlayerUser>> {
    return this.#playerUserRepository.searchAll(dto);
  }
}
