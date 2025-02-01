import {
  BusinessDateDomainService,
  IdUniquenessValidatorDomainService,
  ITeamLeagueSeasonFixtureGameBoxScorePrimitives,
  ITeamLeagueSeasonFixtureGameBoxScoreRepository,
  LeagueSeasonFixtureGameValidationDomainService,
  TeamLeagueSeasonFixtureGameBoxScore,
  TeamValidationDomainService,
  TLSFGBoxScoreCreatedAt,
  TLSFGBoxScoreFixtureGameId,
  TLSFGBoxScoreId,
  TLSFGBoxScoreTeamId,
  TLSFGBoxScoreUpdatedAt,
} from '@basketcol/domain';

import { CreateTeamLeagueSeasonFixtureGameBoxScoreDTO } from '../dtos/CreateTeamLeagueSeasonFixtureGameBoxScoreDTO';
import { ICreateTeamLeagueSeasonFixtureGameBoxScoreUseCase } from './ports/ICreateTeamLeagueSeasonFixtureGameBoxScoreUseCase';
import { IUpdateTeamAllTimeStatsAfterGameUseCase } from '../../../../../../../../../team/all-time-stats/application/use-cases/ports/IUpdateTeamAllTimeStatsAfterGameUseCase';
import { TeamNotParticipatingInFixtureGameError } from '../exceptions/TeamNotParticipatingInFixtureGameError';

interface CreateTeamLeagueSeasonFixtureGameBoxScoreDependencies {
  readonly idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  readonly leagueSeasonFixtureGameValidationDomainService: LeagueSeasonFixtureGameValidationDomainService;
  readonly teamValidationDomainService: TeamValidationDomainService;
  readonly businessDateDomainService: BusinessDateDomainService;
  readonly teamLeagueSeasonFixtureGameBoxScoreRepository: ITeamLeagueSeasonFixtureGameBoxScoreRepository;
  readonly updateTeamAllTimeStatsAfterGameUseCase: IUpdateTeamAllTimeStatsAfterGameUseCase;
}

export class CreateTeamLeagueSeasonFixtureGameBoxScoreUseCase implements ICreateTeamLeagueSeasonFixtureGameBoxScoreUseCase {
  private constructor(
    private readonly dependencies: CreateTeamLeagueSeasonFixtureGameBoxScoreDependencies,
  ) {}

  public static create(
    dependencies: CreateTeamLeagueSeasonFixtureGameBoxScoreDependencies,
  ): CreateTeamLeagueSeasonFixtureGameBoxScoreUseCase {
    return new CreateTeamLeagueSeasonFixtureGameBoxScoreUseCase(dependencies);
  }

  public async execute(dto: CreateTeamLeagueSeasonFixtureGameBoxScoreDTO): Promise<void> {
    const boxScoreId: TLSFGBoxScoreId = TLSFGBoxScoreId.create(dto.id);
    const fixtureGameId: TLSFGBoxScoreFixtureGameId = TLSFGBoxScoreFixtureGameId.create(dto.fixtureGameId);
    const teamId: TLSFGBoxScoreTeamId = TLSFGBoxScoreTeamId.create(dto.teamId);

    await this.validateEntities(boxScoreId, fixtureGameId, teamId);

    const fixtureGame = await this.dependencies.leagueSeasonFixtureGameValidationDomainService
      .ensureLeagueSeasonFixtureGameExists(fixtureGameId);

    this.validateTeamParticipation(dto.teamId, fixtureGame.toPrimitives);

    const hasWonGame = this.determineGameResult(
      dto.teamId,
      fixtureGame.toPrimitives.homeTeamId,
      fixtureGame.toPrimitives.awayTeamId,
      fixtureGame.toPrimitives.homeScore,
      fixtureGame.toPrimitives.awayScore,
    );

    const currentDate = this.dependencies.businessDateDomainService.getCurrentDate();

    const boxScore = this.createBoxScore(dto, currentDate);

    await this.saveBoxScoreAndUpdateStats(boxScore, dto, hasWonGame);
  }

  private async validateEntities(
    boxScoreId: TLSFGBoxScoreId,
    fixtureGameId: TLSFGBoxScoreFixtureGameId,
    teamId: TLSFGBoxScoreTeamId,
  ): Promise<void> {
    await this.dependencies.idUniquenessValidatorDomainService
      .ensureUniqueId<TLSFGBoxScoreId, ITeamLeagueSeasonFixtureGameBoxScorePrimitives, TeamLeagueSeasonFixtureGameBoxScore>(
      boxScoreId,
    );

    await this.dependencies.teamValidationDomainService.ensureTeamExists(teamId);
  }

  private validateTeamParticipation(
    teamId: string,
    fixtureGame: { homeTeamId: string; awayTeamId: string },
  ): void {
    const isHomeTeam = fixtureGame.homeTeamId === teamId;
    const isAwayTeam = fixtureGame.awayTeamId === teamId;

    if (isHomeTeam === false && isAwayTeam === false) {
      throw TeamNotParticipatingInFixtureGameError.create(teamId, fixtureGame.homeTeamId, fixtureGame.awayTeamId);
    }
  }

  private determineGameResult(
    teamId: string,
    homeTeamId: string,
    awayTeamId: string,
    homeScore: number,
    awayScore: number,
  ): boolean {
    const isHomeTeam = homeTeamId === teamId;
    const isHomeTeamWinner = homeScore > awayScore;

    if (isHomeTeam === true) {
      return isHomeTeamWinner;
    }

    return isHomeTeamWinner === false;
  }

  private createBoxScore(
    dto: CreateTeamLeagueSeasonFixtureGameBoxScoreDTO,
    currentDate: TLSFGBoxScoreCreatedAt & TLSFGBoxScoreUpdatedAt,
  ): TeamLeagueSeasonFixtureGameBoxScore {
    return TeamLeagueSeasonFixtureGameBoxScore.create(
      dto.id,
      dto.points,
      dto.offensiveRebounds,
      dto.defensiveRebounds,
      dto.assists,
      dto.steals,
      dto.blocks,
      dto.fouls,
      dto.turnovers,
      dto.threePointersAttempted,
      dto.threePointersMade,
      dto.freeThrowsAttempted,
      dto.freeThrowsMade,
      dto.fieldGoalsAttempted,
      dto.fieldGoalsMade,
      dto.fixtureGameId,
      dto.teamId,
      currentDate.value,
      currentDate.value,
    );
  }

  private async saveBoxScoreAndUpdateStats(
    boxScore: TeamLeagueSeasonFixtureGameBoxScore,
    dto: CreateTeamLeagueSeasonFixtureGameBoxScoreDTO,
    hasWonGame: boolean,
  ): Promise<void> {
    await this.dependencies.teamLeagueSeasonFixtureGameBoxScoreRepository.save(boxScore);

    await this.dependencies.updateTeamAllTimeStatsAfterGameUseCase.execute({
      hasWonGame,
      points: dto.points,
      offensiveRebounds: dto.offensiveRebounds,
      defensiveRebounds: dto.defensiveRebounds,
      assists: dto.assists,
      steals: dto.steals,
      blocks: dto.blocks,
      fouls: dto.fouls,
      turnovers: dto.turnovers,
      threePointersAttempted: dto.threePointersAttempted,
      threePointersMade: dto.threePointersMade,
      freeThrowsAttempted: dto.freeThrowsAttempted,
      freeThrowsMade: dto.freeThrowsMade,
      fieldGoalsAttempted: dto.fieldGoalsAttempted,
      fieldGoalsMade: dto.fieldGoalsMade,
      teamId: dto.teamId,
    });
  }
}
