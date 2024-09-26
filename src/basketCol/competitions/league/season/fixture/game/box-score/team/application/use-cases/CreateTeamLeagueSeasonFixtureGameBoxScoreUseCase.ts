import {
  BusinessDateService,
  IdUniquenessValidatorService,
  ITeamLeagueSeasonFixtureGameBoxScore,
  ITeamLeagueSeasonFixtureGameBoxScoreRepository,
  LeagueSeasonFixtureGameValidationService,
  TeamLeagueSeasonFixtureGameBoxScore,
  TeamValidationService,
  TLSFGBoxScoreCreatedAt,
  TLSFGBoxScoreFixtureGameId,
  TLSFGBoxScoreId,
  TLSFGBoxScoreTeamId,
  TLSFGBoxScoreUpdatedAt,
} from '@basketcol/domain';

import { CreateTeamLeagueSeasonFixtureGameBoxScoreDTO } from '../dtos/CreateTeamLeagueSeasonFixtureGameBoxScoreDTO';
import { ICreateTeamLeagueSeasonFixtureGameBoxScoreUseCase } from './ports/ICreateTeamLeagueSeasonFixtureGameBoxScoreUseCase';

type Dependencies = {
  idUniquenessValidatorService: IdUniquenessValidatorService;
  leagueSeasonFixtureGameValidationService: LeagueSeasonFixtureGameValidationService;
  teamValidationService: TeamValidationService;
  businessDateService: BusinessDateService;
  teamLeagueSeasonFixtureGameBoxScoreRepository: ITeamLeagueSeasonFixtureGameBoxScoreRepository;
};

export class CreateTeamLeagueSeasonFixtureGameBoxScoreUseCase implements ICreateTeamLeagueSeasonFixtureGameBoxScoreUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #leagueSeasonFixtureGameValidationService: LeagueSeasonFixtureGameValidationService;

  readonly #teamValidationService: TeamValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #teamLeagueSeasonFixtureGameBoxScoreRepository: ITeamLeagueSeasonFixtureGameBoxScoreRepository;

  constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#leagueSeasonFixtureGameValidationService = dependencies.leagueSeasonFixtureGameValidationService;
    this.#teamValidationService = dependencies.teamValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#teamLeagueSeasonFixtureGameBoxScoreRepository = dependencies.teamLeagueSeasonFixtureGameBoxScoreRepository;
  }

  public async execute(dto: CreateTeamLeagueSeasonFixtureGameBoxScoreDTO): Promise<void> {
    const {
      id,
      points,
      offensiveRebounds,
      defensiveRebounds,
      assists,
      steals,
      blocks,
      fouls,
      turnovers,
      threePointersAttempted,
      threePointersMade,
      freeThrowsAttempted,
      freeThrowsMade,
      fieldGoalsAttempted,
      fieldGoalsMade,
      fixtureGameId,
      teamId,
    } = dto;

    const tLSFGBoxScoreId: TLSFGBoxScoreId = TLSFGBoxScoreId.create(id);
    const tLSFGBoxScoreFixtureGameId: TLSFGBoxScoreFixtureGameId = TLSFGBoxScoreFixtureGameId.create(fixtureGameId);
    const tLSFGBoxScoreTeamId: TLSFGBoxScoreTeamId = TLSFGBoxScoreTeamId.create(teamId);

    await this.#idUniquenessValidatorService.ensureUniqueId<TLSFGBoxScoreId, ITeamLeagueSeasonFixtureGameBoxScore, TeamLeagueSeasonFixtureGameBoxScore>(tLSFGBoxScoreId);
    await this.#leagueSeasonFixtureGameValidationService.ensureLeagueSeasonFixtureGameExists(tLSFGBoxScoreFixtureGameId.value);
    await this.#teamValidationService.ensureTeamExists(tLSFGBoxScoreTeamId.value);

    const tLSFGBoxScoreCreatedAt: TLSFGBoxScoreCreatedAt = this.#businessDateService.getCurrentDate();
    const tLSFGBoxScoreUpdatedAt: TLSFGBoxScoreUpdatedAt = this.#businessDateService.getCurrentDate();

    const teamLeagueSeasonFixtureGameBoxScore: TeamLeagueSeasonFixtureGameBoxScore = TeamLeagueSeasonFixtureGameBoxScore.create(
      id,
      points,
      offensiveRebounds,
      defensiveRebounds,
      assists,
      steals,
      blocks,
      fouls,
      turnovers,
      threePointersAttempted,
      threePointersMade,
      freeThrowsAttempted,
      freeThrowsMade,
      fieldGoalsAttempted,
      fieldGoalsMade,
      tLSFGBoxScoreFixtureGameId.fixtureGameIdAsString,
      tLSFGBoxScoreTeamId.teamIdAsString,
      tLSFGBoxScoreCreatedAt.value,
      tLSFGBoxScoreUpdatedAt.value,
    );

    return this.#teamLeagueSeasonFixtureGameBoxScoreRepository.save(teamLeagueSeasonFixtureGameBoxScore);
  }
}
