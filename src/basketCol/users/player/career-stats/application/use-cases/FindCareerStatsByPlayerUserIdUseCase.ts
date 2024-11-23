import {
  IPlayerUserCareerStatsRepository,
  Nullable,
  PlayerUserCareerStats, PUCStatsPlayerUserId,
} from '@basketcol/domain';

import { IFindCareerStatsByPlayerUserIdUseCase } from './ports/IFindCareerStatsByPlayerUserIdUseCase';
import { FindCareerStatsByPlayerUserIdDTO } from '../dtos/FindCareerStatsByPlayerUserIdDTO';

type Dependencies = {
  readonly playerUserCareerStatsRepository: IPlayerUserCareerStatsRepository;
};

export class FindCareerStatsByPlayerUserIdUseCase implements IFindCareerStatsByPlayerUserIdUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): FindCareerStatsByPlayerUserIdUseCase {
    return new FindCareerStatsByPlayerUserIdUseCase(dependencies);
  }

  public execute(dto: FindCareerStatsByPlayerUserIdDTO): Promise<Nullable<PlayerUserCareerStats>> {
    const playerUserId: PUCStatsPlayerUserId = PUCStatsPlayerUserId.create(dto.playerUserId);
    return this.dependencies.playerUserCareerStatsRepository.findByPlayerUserId(playerUserId);
  }
}
