import {
  IPlayerUserRepository,
  Nullable,
  PlayerUser,
  PlayerUserId,
} from '@basketcol/domain';

import { IFindPlayerUserByIdUseCase } from './ports/IFindPlayerUserByIdUseCase';
import { FindPlayerUserByIdDTO } from '../dtos/FindPlayerUserByIdDTO';

type Dependencies = {
  readonly playerUserRepository: IPlayerUserRepository;
};

export class FindPlayerUserByIdUseCase implements IFindPlayerUserByIdUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): FindPlayerUserByIdUseCase {
    return new FindPlayerUserByIdUseCase(dependencies);
  }

  public execute(dto: FindPlayerUserByIdDTO): Promise<Nullable<PlayerUser>> {
    const playerUserId: PlayerUserId = PlayerUserId.create(dto.id);
    return this.dependencies.playerUserRepository.findById(playerUserId);
  }
}
