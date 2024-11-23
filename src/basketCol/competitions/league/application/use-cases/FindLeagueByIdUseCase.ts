import {
  ILeagueRepository,
  League,
  LeagueId,
  Nullable,
} from '@basketcol/domain';

import { IFindLeagueByIdUseCase } from './ports/IFindLeagueByIdUseCase';
import { FindLeagueByIdDTO } from '../dtos/FindLeagueByIdDTO';

type Dependencies = {
  readonly leagueRepository: ILeagueRepository;
};

export class FindLeagueByIdUseCase implements IFindLeagueByIdUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): FindLeagueByIdUseCase {
    return new FindLeagueByIdUseCase(dependencies);
  }

  public execute(dto: FindLeagueByIdDTO): Promise<Nullable<League>> {
    const leagueId: LeagueId = LeagueId.create(dto.id);
    return this.dependencies.leagueRepository.findById(leagueId);
  }
}
