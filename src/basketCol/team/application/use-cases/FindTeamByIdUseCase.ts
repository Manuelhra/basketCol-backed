import {
  ITeamRepository,
  Nullable,
  Team,
  TeamId,
} from '@basketcol/domain';

import { IFindTeamByIdUseCase } from './ports/IFindTeamByIdUseCase';
import { FindTeamByIdDTO } from '../dtos/FindTeamByIdDTO';

type Dependencies = {
  readonly teamRepository: ITeamRepository;
};

export class FindTeamByIdUseCase implements IFindTeamByIdUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): FindTeamByIdUseCase {
    return new FindTeamByIdUseCase(dependencies);
  }

  public execute(dto: FindTeamByIdDTO): Promise<Nullable<Team>> {
    const teamId: TeamId = TeamId.create(dto.id);
    return this.dependencies.teamRepository.findById(teamId);
  }
}
