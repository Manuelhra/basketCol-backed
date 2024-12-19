import {
  ILeagueSeasonAwardsRepository,
  ILeagueSeasonRepository,
  IPlayerUserRepository,
  ITeamRepository,
  LeagueSeason,
  LeagueSeasonAwards,
  LeagueSeasonNotFoundError,
  LSALeagueSeasonId,
  Nullable,
  PlayerUser,
  PlayerUserId,
  Team,
  TeamId,
  TeamNotFoundError,
} from '@basketcol/domain';

import {
  IFindLeagueSeasonAwardsByLeagueSeasonIdUseCase,
  IFindLeagueSeasonAwardsByLeagueSeasonIdUseCaseResponse,
} from './ports/IFindLeagueSeasonAwardsByLeagueSeasonIdUseCase';
import { FindLeagueSeasonAwardsByLeagueSeasonIdDTO } from '../dtos/FindLeagueSeasonAwardsByLeagueSeasonIdDTO';

interface Dependencies {
  readonly leagueSeasonAwardsRepository: ILeagueSeasonAwardsRepository;
  readonly leagueSeasonRepository: ILeagueSeasonRepository;
  readonly playerUserRepository: IPlayerUserRepository;
  readonly teamRepository: ITeamRepository;
}

export class FindLeagueSeasonAwardsByLeagueSeasonIdUseCase
implements IFindLeagueSeasonAwardsByLeagueSeasonIdUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): FindLeagueSeasonAwardsByLeagueSeasonIdUseCase {
    return new FindLeagueSeasonAwardsByLeagueSeasonIdUseCase(dependencies);
  }

  public async execute(
    dto: FindLeagueSeasonAwardsByLeagueSeasonIdDTO,
  ): Promise<IFindLeagueSeasonAwardsByLeagueSeasonIdUseCaseResponse | null> {
    const leagueSeasonId = LSALeagueSeasonId.create(dto.leagueSeasonId);

    // Find league season awards
    const leagueSeasonAwards = await this.#findLeagueSeasonAwards(leagueSeasonId);
    if (!leagueSeasonAwards) return null;

    const leagueSeason = await this.#findLeagueSeason(leagueSeasonId);
    const playerUserList = await this.#fetchPlayerUsers(leagueSeasonAwards);
    const championTeam = await this.#findChampionTeam(leagueSeasonAwards);

    return {
      championTeam,
      leagueSeason,
      leagueSeasonAwards,
      playerUserList,
    };
  }

  async #findLeagueSeasonAwards(
    leagueSeasonId: LSALeagueSeasonId,
  ): Promise<Nullable<LeagueSeasonAwards>> {
    const leagueSeasonAwards = await this.dependencies.leagueSeasonAwardsRepository
      .findByLeagueSeasonId(leagueSeasonId);

    return leagueSeasonAwards;
  }

  async #findLeagueSeason(
    leagueSeasonId: LSALeagueSeasonId,
  ): Promise<LeagueSeason> {
    const leagueSeason = await this.dependencies.leagueSeasonRepository
      .findById(leagueSeasonId);

    if (!leagueSeason) {
      throw LeagueSeasonNotFoundError.create(leagueSeasonId);
    }

    return leagueSeason;
  }

  async #fetchPlayerUsers(
    leagueSeasonAwards: LeagueSeasonAwards,
  ): Promise<PlayerUser[]> {
    const { toPrimitives: awards } = leagueSeasonAwards;

    const playerUserPromises = [
      awards.bestAssistProviderId,
      awards.bestDefensiveRebounderId,
      awards.bestFreeThrowShooterId,
      awards.bestOffensiveRebounderId,
      awards.bestThreePointShooterId,
      awards.bestTwoPointShooterId,
      awards.mostValuablePlayerId,
    ].map((id) => this.dependencies.playerUserRepository.findById(PlayerUserId.create(id)));

    const playerUserList = (await Promise.all(playerUserPromises))
      .filter((playerUser): playerUser is PlayerUser => playerUser !== null && playerUser !== undefined);

    return playerUserList;
  }

  async #findChampionTeam(
    leagueSeasonAwards: LeagueSeasonAwards,
  ): Promise<Team> {
    const championTeamId = TeamId.create(leagueSeasonAwards.toPrimitives.championTeamId);
    const championTeam = await this.dependencies.teamRepository.findById(championTeamId);

    if (!championTeam) {
      throw TeamNotFoundError.create(championTeamId);
    }

    return championTeam;
  }
}
