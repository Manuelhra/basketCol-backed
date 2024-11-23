import { ITeamPlayerRepository, TeamPlayer, TeamPlayerTeamId } from '@basketcol/domain';

import { IFindAllTeamActivePlayersUseCase } from './ports/IFindAllTeamActivePlayersUseCase';
import { FindAllTeamActivePlayersDTO } from '../dtos/FindAllTeamActivePlayersDTO';

type Dependencies = {
  readonly teamPlayerRepository: ITeamPlayerRepository;
};

export class FindAllTeamActivePlayersUseCase implements IFindAllTeamActivePlayersUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): FindAllTeamActivePlayersUseCase {
    return new FindAllTeamActivePlayersUseCase(dependencies);
  }

  public execute(dto: FindAllTeamActivePlayersDTO): Promise<TeamPlayer[]> {
    const teamId: TeamPlayerTeamId = TeamPlayerTeamId.create(dto.teamId);
    return this.dependencies.teamPlayerRepository.findAllActivePlayersByTeamId(teamId);
  }
}
