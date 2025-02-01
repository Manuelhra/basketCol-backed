import {
  IPlayerUserCareerStatsRepository,
  IPlayerUserRepository,
  Nullable,
  PlayerUser,
  PlayerUserCareerStats,
  PlayerUserId,
} from '@basketcol/domain';

import { IFindPlayerUserByIdUseCase, IFindPlayerUserByIdUseCaseResponse } from './ports/IFindPlayerUserByIdUseCase';
import { FindPlayerUserByIdDTO } from '../dtos/FindPlayerUserByIdDTO';

type Dependencies = {
  readonly playerUserRepository: IPlayerUserRepository;
  readonly playerUserCareerStatsRepository: IPlayerUserCareerStatsRepository;
};

export class FindPlayerUserByIdUseCase implements IFindPlayerUserByIdUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): FindPlayerUserByIdUseCase {
    return new FindPlayerUserByIdUseCase(dependencies);
  }

  public async execute(dto: FindPlayerUserByIdDTO): Promise<IFindPlayerUserByIdUseCaseResponse> {
    const playerUserId: PlayerUserId = PlayerUserId.create(dto.id);
    const playerUser: Nullable<PlayerUser> = await this.dependencies.playerUserRepository.findById(playerUserId);

    if (playerUser === null || playerUser === undefined) {
      return this.#emptyResponse();
    }

    const playerUserCareerStats: Nullable<PlayerUserCareerStats> = await this.dependencies.playerUserCareerStatsRepository.findByPlayerUserId(playerUser.id);

    if (playerUserCareerStats === null || playerUserCareerStats === undefined) {
      return this.#emptyResponse();
    }

    return {
      playerUser,
      playerUserCareerStats,
    };
  }

  #emptyResponse(): IFindPlayerUserByIdUseCaseResponse {
    return null;
  }
}
