import {
  ILeagueRepository,
  ILeagueTeamRepository,
  ITeamRepository,
  League,
  LeagueId,
  LeagueNotFoundError,
  LeagueTeam,
  LeagueTeamLeagueId,
  LeagueTeamStatus,
  Nullable,
  Team,
  TeamId,
} from '@basketcol/domain';

import { IFindAllLeagueTeamsByLeagueIdUseCase, IFindAllLeagueTeamsByLeagueIdUseCaseResponse } from './ports/IFindAllLeagueTeamsByLeagueIdUseCase';
import { FindAllLeagueTeamsByLeagueIdDTO } from '../dtos/FindAllLeagueTeamsByLeagueIdDTO';

type Dependencies = {
  readonly leagueTeamRepository: ILeagueTeamRepository;
  readonly teamRepository: ITeamRepository;
  readonly leagueRepository: ILeagueRepository;
};

export class FindAllLeagueTeamsByLeagueIdUseCase implements IFindAllLeagueTeamsByLeagueIdUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): FindAllLeagueTeamsByLeagueIdUseCase {
    return new FindAllLeagueTeamsByLeagueIdUseCase(dependencies);
  }

  public async execute(dto: FindAllLeagueTeamsByLeagueIdDTO): Promise<IFindAllLeagueTeamsByLeagueIdUseCaseResponse> {
    const leagueId: LeagueId = LeagueId.create(dto.leagueId);

    const [leagueTeams, league] = await this.#fetchLeagueTeamsAndLeague(leagueId, dto.status !== null ? LeagueTeamStatus.create(dto.status) : LeagueTeamStatus.createActive());
    const teamList = (await this.#fetchTeams(leagueTeams)).filter((team): team is Team => team !== null);

    return {
      leagueTeams,
      leagueInfo: league,
      teamList,
    };
  }

  async #fetchLeagueTeamsAndLeague(leagueId: LeagueTeamLeagueId, status: LeagueTeamStatus): Promise<[LeagueTeam[], League]> {
    const leagueTeams = await this.dependencies.leagueTeamRepository.findAllByLeagueId(leagueId, status);

    const league: Nullable<League> = await this.dependencies.leagueRepository.findById(leagueId);
    if (league === null || league === undefined) {
      throw LeagueNotFoundError.create(leagueId);
    }

    return [leagueTeams, league];
  }

  async #fetchTeams(leagueTeams: LeagueTeam[]): Promise<Nullable<Team>[]> {
    const teamPromises = leagueTeams.map((leagueTeam) => this.dependencies.teamRepository.findById(
      TeamId.create(leagueTeam.toPrimitives.teamId),
    ));

    return Promise.all(teamPromises);
  }
}
