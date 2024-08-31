import {
  BusinessDateService,
  CourtValidationService,
  IdUniquenessValidatorService,
  ILeagueSeasonFixtureGame,
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

export class CreateLeagueSeasonFixtureGameUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #teamValidationService: TeamValidationService;

  readonly #refereeUserValidationService: RefereeUserValidationService;

  readonly #courtValidationService: CourtValidationService;

  readonly #leagueSeasonValidationService: LeagueSeasonValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #leagueSeasonFixtureGameRepository: ILeagueSeasonFixtureGameRepository;

  constructor(dependencies: {
    idUniquenessValidatorService: IdUniquenessValidatorService;
    teamValidationService: TeamValidationService;
    refereeUserValidationService: RefereeUserValidationService;
    courtValidationService: CourtValidationService;
    leagueSeasonValidationService: LeagueSeasonValidationService;
    businessDateService: BusinessDateService;
    leagueSeasonFixtureGameRepository: ILeagueSeasonFixtureGameRepository;
  }) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#teamValidationService = dependencies.teamValidationService;
    this.#refereeUserValidationService = dependencies.refereeUserValidationService;
    this.#courtValidationService = dependencies.courtValidationService;
    this.#leagueSeasonValidationService = dependencies.leagueSeasonValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#leagueSeasonFixtureGameRepository = dependencies.leagueSeasonFixtureGameRepository;
  }

  public async run(payload: CreateLeagueSeasonFixtureGameDTO): Promise<void> {
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
      headRefereeId,
      assistantRefereeId,
      courtId,
      fixtureId,
    } = payload;

    const lSFGameId: LSFGameId = new LSFGameId(id);
    const lSFGameHomeTeamId: LSFGameHomeTeamId = new LSFGameHomeTeamId(homeTeamId);
    const lSFGameAwayTeamId: LSFGameAwayTeamId = new LSFGameAwayTeamId(awayTeamId);
    const lSFGameHomeScore: LSFGameHomeScore = new LSFGameHomeScore(homeScore);
    const lSFGameAwayScore: LSFGameAwayScore = new LSFGameAwayScore(awayScore);
    const lSFGameType: LSFGameType = new LSFGameType(gameType);
    const lSFGameHeadRefereeId: LSFGameHeadRefereeId = new LSFGameHeadRefereeId(headRefereeId);
    const lSFGameAssistantRefereeId: LSFGameAssistantRefereeId = new LSFGameAssistantRefereeId(assistantRefereeId);
    const lSFGameCourtId: LSFGameCourtId = new LSFGameCourtId(courtId);
    const lSFGameFixtureId: LSFGameFixtureId = new LSFGameFixtureId(fixtureId);

    await this.#idUniquenessValidatorService.ensureUniqueId<LSFGameId, ILeagueSeasonFixtureGame, LeagueSeasonFixtureGame>(lSFGameId);
    await this.#teamValidationService.ensureTeamExists(lSFGameHomeTeamId.value);
    await this.#teamValidationService.ensureTeamExists(lSFGameAwayTeamId.value);
    await this.#refereeUserValidationService.ensureRefereeUserExists(lSFGameHeadRefereeId.value);
    await this.#refereeUserValidationService.ensureRefereeUserExists(lSFGameAssistantRefereeId.value);
    await this.#courtValidationService.ensureCourtExists(lSFGameCourtId.value);
    await this.#leagueSeasonValidationService.ensureLeagueSeasonExists(lSFGameFixtureId.value);

    const lSFGameCreatedAt: LSFGameCreatedAt = this.#businessDateService.getCurrentDate();
    const lSFGameUpdatedAt: LSFGameUpdatedAt = this.#businessDateService.getCurrentDate();

    const leagueSeasonFixtureGame: LeagueSeasonFixtureGame = new LeagueSeasonFixtureGame(
      lSFGameId.value,
      startTime,
      endTime,
      lSFGameHomeTeamId.teamIdAsString,
      lSFGameAwayTeamId.teamIdAsString,
      lSFGameHomeScore.value,
      lSFGameAwayScore.value,
      lSFGameType.value,
      gameDuration,
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
