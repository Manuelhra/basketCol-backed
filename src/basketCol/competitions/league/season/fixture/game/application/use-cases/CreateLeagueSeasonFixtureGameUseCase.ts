import {
  BusinessDateDomainService,
  CourtValidationDomainService,
  HostUserType,
  IdUniquenessValidatorDomainService,
  ILeagueSeasonFixtureGamePrimitives,
  ILeagueSeasonFixtureGameRepository,
  LeagueSeasonFixtureGame,
  LeagueSeasonFixtureValidationDomainService,
  LSFGameAssistantRefereeId,
  LSFGameAwayTeamId,
  LSFGameCourtId,
  LSFGameCreatedAt,
  LSFGameFixtureId,
  LSFGameHeadRefereeId,
  LSFGameHomeTeamId,
  LSFGameId,
  LSFGameStatus,
  LSFGameType,
  LSFGameUpdatedAt,
  RefereeUserValidationDomainService,
  TeamValidationDomainService,
} from '@basketcol/domain';

import { CreateLeagueSeasonFixtureGameDTO } from '../dtos/CreateLeagueSeasonFixtureGameDTO';
import { ICreateLeagueSeasonFixtureGameUseCase } from './ports/ICreateLeagueSeasonFixtureGameUseCase';
import { IUserContext } from '../../../../../../../shared/application/context/ports/IUserContext';
import { UnauthorizedAccessError } from '../../../../../../../shared/application/exceptions/UnauthorizedAccessError';

type Dependencies = {
  readonly idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  readonly teamValidationDomainService: TeamValidationDomainService;
  readonly refereeUserValidationDomainService: RefereeUserValidationDomainService;
  readonly courtValidationDomainService: CourtValidationDomainService;
  readonly leagueSeasonFixtureValidationDomainService: LeagueSeasonFixtureValidationDomainService;
  readonly businessDateDomainService: BusinessDateDomainService;
  readonly leagueSeasonFixtureGameRepository: ILeagueSeasonFixtureGameRepository;
};

export class CreateLeagueSeasonFixtureGameUseCase implements ICreateLeagueSeasonFixtureGameUseCase {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): CreateLeagueSeasonFixtureGameUseCase {
    return new CreateLeagueSeasonFixtureGameUseCase(dependencies);
  }

  public async execute(dto: CreateLeagueSeasonFixtureGameDTO, userContext: IUserContext): Promise<void> {
    this.#validateUserAccess(userContext);
    const leagueSeasonFixtureGame: LeagueSeasonFixtureGame = await this.#createLeagueSeasonFixtureGame(dto);
    return this.dependencies.leagueSeasonFixtureGameRepository.save(leagueSeasonFixtureGame);
  }

  async #createLeagueSeasonFixtureGame(dto: CreateLeagueSeasonFixtureGameDTO): Promise<LeagueSeasonFixtureGame> {
    const {
      id,
      startTime,
      homeTeamId,
      awayTeamId,
      gameType,
      gameDuration,
      headRefereeId,
      assistantRefereeId,
      courtId,
      fixtureId,
    } = dto;

    const lSFGameId: LSFGameId = LSFGameId.create(id);
    const lSFGameHomeTeamId: LSFGameHomeTeamId = LSFGameHomeTeamId.create(homeTeamId);
    const lSFGameAwayTeamId: LSFGameAwayTeamId = LSFGameAwayTeamId.create(awayTeamId);
    const lSFGameType: LSFGameType = LSFGameType.create(gameType);
    const lSFGameHeadRefereeId: LSFGameHeadRefereeId = LSFGameHeadRefereeId.create(headRefereeId);
    const lSFGameAssistantRefereeId: LSFGameAssistantRefereeId = LSFGameAssistantRefereeId.create(assistantRefereeId);
    const lSFGameCourtId: LSFGameCourtId = LSFGameCourtId.create(courtId);
    const lSFGameFixtureId: LSFGameFixtureId = LSFGameFixtureId.create(fixtureId);

    await this.#validateLeagueSeasonFixtureGameCreation(
      lSFGameId,
      lSFGameHomeTeamId,
      lSFGameAwayTeamId,
      lSFGameHeadRefereeId,
      lSFGameAssistantRefereeId,
      lSFGameCourtId,
      lSFGameFixtureId,
    );

    const lSFGameStatus: LSFGameStatus = LSFGameStatus.createUpcoming();
    const lSFGameCreatedAt: LSFGameCreatedAt = this.dependencies.businessDateDomainService.getCurrentDate();
    const lSFGameUpdatedAt: LSFGameUpdatedAt = this.dependencies.businessDateDomainService.getCurrentDate();

    return LeagueSeasonFixtureGame.create(
      lSFGameId.value,
      startTime,
      null,
      lSFGameHomeTeamId.value,
      lSFGameAwayTeamId.value,
      0,
      0,
      lSFGameType.value,
      gameDuration,
      null,
      false,
      null,
      lSFGameStatus.value,
      lSFGameHeadRefereeId.value,
      lSFGameAssistantRefereeId.value,
      lSFGameCourtId.value,
      lSFGameFixtureId.value,
      lSFGameCreatedAt.value,
      lSFGameUpdatedAt.value,
    );
  }

  async #validateLeagueSeasonFixtureGameCreation(
    lSFGameId: LSFGameId,
    lSFGameHomeTeamId: LSFGameHomeTeamId,
    lSFGameAwayTeamId: LSFGameAwayTeamId,
    lSFGameHeadRefereeId: LSFGameHeadRefereeId,
    lSFGameAssistantRefereeId: LSFGameAssistantRefereeId,
    lSFGameCourtId: LSFGameCourtId,
    lSFGameFixtureId: LSFGameFixtureId,
  ): Promise<void> {
    await this.dependencies.idUniquenessValidatorDomainService.ensureUniqueId<LSFGameId, ILeagueSeasonFixtureGamePrimitives, LeagueSeasonFixtureGame>(lSFGameId);
    await this.dependencies.teamValidationDomainService.ensureTeamExists(lSFGameHomeTeamId);
    await this.dependencies.teamValidationDomainService.ensureTeamExists(lSFGameAwayTeamId);
    await this.dependencies.refereeUserValidationDomainService.ensureRefereeUserExists(lSFGameHeadRefereeId);
    await this.dependencies.refereeUserValidationDomainService.ensureRefereeUserExists(lSFGameAssistantRefereeId);
    await this.dependencies.courtValidationDomainService.ensureCourtExists(lSFGameCourtId);
    await this.dependencies.leagueSeasonFixtureValidationDomainService.ensureLeagueSeasonFixtureExists(lSFGameFixtureId);
  }

  #validateUserAccess(userContext: IUserContext): void {
    if (userContext.userType !== HostUserType.value) {
      throw UnauthorizedAccessError.create(userContext, HostUserType.value, 'create a league season fixture game');
    }
  }
}
