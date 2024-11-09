import {
  BusinessDateService,
  CourtValidationService,
  IdUniquenessValidatorService,
  ILeagueSeasonFixtureGamePrimitives,
  ILeagueSeasonFixtureGameRepository,
  LeagueSeasonFixtureGame,
  LeagueSeasonValidationService,
  LSFGameAssistantRefereeId,
  LSFGameAwayScore,
  LSFGameAwayTeamId,
  LSFGameCourtId,
  LSFGameCreatedAt,
  LSFGameFixtureId,
  LSFGameHeadRefereeId,
  LSFGameHomeScore,
  LSFGameHomeTeamId,
  LSFGameId,
  LSFGameType,
  LSFGameUpdatedAt,
  RefereeUserValidationService,
  TeamValidationService,
} from '@basketcol/domain';

import { CreateLeagueSeasonFixtureGameDTO } from '../dtos/CreateLeagueSeasonFixtureGameDTO';
import { ICreateLeagueSeasonFixtureGameUseCase } from './ports/ICreateLeagueSeasonFixtureGameUseCase';

type Dependencies = {
  idUniquenessValidatorService: IdUniquenessValidatorService;
  teamValidationService: TeamValidationService;
  refereeUserValidationService: RefereeUserValidationService;
  courtValidationService: CourtValidationService;
  leagueSeasonValidationService: LeagueSeasonValidationService;
  businessDateService: BusinessDateService;
  leagueSeasonFixtureGameRepository: ILeagueSeasonFixtureGameRepository;
};

export class CreateLeagueSeasonFixtureGameUseCase implements ICreateLeagueSeasonFixtureGameUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #teamValidationService: TeamValidationService;

  readonly #refereeUserValidationService: RefereeUserValidationService;

  readonly #courtValidationService: CourtValidationService;

  readonly #leagueSeasonValidationService: LeagueSeasonValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #leagueSeasonFixtureGameRepository: ILeagueSeasonFixtureGameRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#teamValidationService = dependencies.teamValidationService;
    this.#refereeUserValidationService = dependencies.refereeUserValidationService;
    this.#courtValidationService = dependencies.courtValidationService;
    this.#leagueSeasonValidationService = dependencies.leagueSeasonValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#leagueSeasonFixtureGameRepository = dependencies.leagueSeasonFixtureGameRepository;
  }

  public static create(dependencies: Dependencies): CreateLeagueSeasonFixtureGameUseCase {
    return new CreateLeagueSeasonFixtureGameUseCase(dependencies);
  }

  public async execute(dto: CreateLeagueSeasonFixtureGameDTO): Promise<void> {
    const {
      id,
      startTime,
      endTime,
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
      gameType,
      gameDuration,
      quarter,
      overtime,
      overtimeNumber,
      gameStatus,
      headRefereeId,
      assistantRefereeId,
      courtId,
      fixtureId,
    } = dto;

    const lSFGameId: LSFGameId = LSFGameId.create(id);
    const lSFGameHomeTeamId: LSFGameHomeTeamId = LSFGameHomeTeamId.create(homeTeamId);
    const lSFGameAwayTeamId: LSFGameAwayTeamId = LSFGameAwayTeamId.create(awayTeamId);
    const lSFGameHomeScore: LSFGameHomeScore = LSFGameHomeScore.create(homeScore);
    const lSFGameAwayScore: LSFGameAwayScore = LSFGameAwayScore.create(awayScore);
    const lSFGameType: LSFGameType = LSFGameType.create(gameType);
    const lSFGameHeadRefereeId: LSFGameHeadRefereeId = LSFGameHeadRefereeId.create(headRefereeId);
    const lSFGameAssistantRefereeId: LSFGameAssistantRefereeId = LSFGameAssistantRefereeId.create(assistantRefereeId);
    const lSFGameCourtId: LSFGameCourtId = LSFGameCourtId.create(courtId);
    const lSFGameFixtureId: LSFGameFixtureId = LSFGameFixtureId.create(fixtureId);

    await this.#idUniquenessValidatorService.ensureUniqueId<LSFGameId, ILeagueSeasonFixtureGamePrimitives, LeagueSeasonFixtureGame>(lSFGameId);
    await this.#teamValidationService.ensureTeamExists(lSFGameHomeTeamId.value);
    await this.#teamValidationService.ensureTeamExists(lSFGameAwayTeamId.value);
    await this.#refereeUserValidationService.ensureRefereeUserExists(lSFGameHeadRefereeId.value);
    await this.#refereeUserValidationService.ensureRefereeUserExists(lSFGameAssistantRefereeId.value);
    await this.#courtValidationService.ensureCourtExists(lSFGameCourtId.value);
    await this.#leagueSeasonValidationService.ensureLeagueSeasonExists(lSFGameFixtureId.value);

    const lSFGameCreatedAt: LSFGameCreatedAt = this.#businessDateService.getCurrentDate();
    const lSFGameUpdatedAt: LSFGameUpdatedAt = this.#businessDateService.getCurrentDate();

    const leagueSeasonFixtureGame: LeagueSeasonFixtureGame = LeagueSeasonFixtureGame.create(
      lSFGameId.value,
      startTime,
      endTime,
      lSFGameHomeTeamId.teamIdAsString,
      lSFGameAwayTeamId.teamIdAsString,
      lSFGameHomeScore.value,
      lSFGameAwayScore.value,
      lSFGameType.value,
      gameDuration,
      quarter,
      overtime,
      overtimeNumber,
      gameStatus,
      lSFGameHeadRefereeId.refereeUserIdAsString,
      lSFGameAssistantRefereeId.refereeUserIdAsString,
      lSFGameCourtId.courtIdAsString,
      lSFGameFixtureId.fixtureIdAsString,
      lSFGameCreatedAt.value,
      lSFGameUpdatedAt.value,
    );

    return this.#leagueSeasonFixtureGameRepository.save(leagueSeasonFixtureGame);
  }
}
