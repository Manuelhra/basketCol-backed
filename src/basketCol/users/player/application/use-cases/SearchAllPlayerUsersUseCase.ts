import { IPaginatedResponse, IPlayerUserRepository, PlayerUser } from '@basketcol/domain';

import { SearchAllPlayerUsersDTO } from '../dtos/SearchAllPlayerUsersDTO';
import { ISearchAllPlayerUsersUseCase } from './ports/ISearchAllPlayerUsersUseCase';

type Dependencies = {
  readonly playerUserRepository: IPlayerUserRepository;
};

export class SearchAllPlayerUsersUseCase implements ISearchAllPlayerUsersUseCase {
  readonly #playerUserRepository: IPlayerUserRepository;

  private constructor(dependencies: Dependencies) {
    this.#playerUserRepository = dependencies.playerUserRepository;
  }

  public static create(dependencies: Dependencies): SearchAllPlayerUsersUseCase {
    return new SearchAllPlayerUsersUseCase(dependencies);
  }

  public execute(dto: SearchAllPlayerUsersDTO): Promise<IPaginatedResponse<PlayerUser>> {
    return this.#playerUserRepository.searchAll(dto);
  }
}
