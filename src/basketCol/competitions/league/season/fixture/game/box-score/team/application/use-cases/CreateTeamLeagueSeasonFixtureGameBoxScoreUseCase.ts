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

type Dependencies = {
  idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  leagueSeasonFixtureGameValidationDomainService: LeagueSeasonFixtureGameValidationDomainService;
  teamValidationDomainService: TeamValidationDomainService;
  businessDateDomainService: BusinessDateDomainService;
  teamLeagueSeasonFixtureGameBoxScoreRepository: ITeamLeagueSeasonFixtureGameBoxScoreRepository;
};

export class CreateTeamLeagueSeasonFixtureGameBoxScoreUseCase implements ICreateTeamLeagueSeasonFixtureGameBoxScoreUseCase {
  readonly #idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;

  readonly #leagueSeasonFixtureGameValidationDomainService: LeagueSeasonFixtureGameValidationDomainService;

  readonly #teamValidationDomainService: TeamValidationDomainService;

  readonly #businessDateDomainService: BusinessDateDomainService;

  readonly #teamLeagueSeasonFixtureGameBoxScoreRepository: ITeamLeagueSeasonFixtureGameBoxScoreRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorDomainService = dependencies.idUniquenessValidatorDomainService;
    this.#leagueSeasonFixtureGameValidationDomainService = dependencies.leagueSeasonFixtureGameValidationDomainService;
    this.#teamValidationDomainService = dependencies.teamValidationDomainService;
    this.#businessDateDomainService = dependencies.businessDateDomainService;
    this.#teamLeagueSeasonFixtureGameBoxScoreRepository = dependencies.teamLeagueSeasonFixtureGameBoxScoreRepository;
  }

  public static create(dependencies: Dependencies): CreateTeamLeagueSeasonFixtureGameBoxScoreUseCase {
    return new CreateTeamLeagueSeasonFixtureGameBoxScoreUseCase(dependencies);
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

    await this.#idUniquenessValidatorDomainService.ensureUniqueId<TLSFGBoxScoreId, ITeamLeagueSeasonFixtureGameBoxScorePrimitives, TeamLeagueSeasonFixtureGameBoxScore>(tLSFGBoxScoreId);
    await this.#leagueSeasonFixtureGameValidationDomainService.ensureLeagueSeasonFixtureGameExists(tLSFGBoxScoreFixtureGameId);
    await this.#teamValidationDomainService.ensureTeamExists(tLSFGBoxScoreTeamId);

    const tLSFGBoxScoreCreatedAt: TLSFGBoxScoreCreatedAt = this.#businessDateDomainService.getCurrentDate();
    const tLSFGBoxScoreUpdatedAt: TLSFGBoxScoreUpdatedAt = this.#businessDateDomainService.getCurrentDate();

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
      tLSFGBoxScoreFixtureGameId.value,
      tLSFGBoxScoreTeamId.value,
      tLSFGBoxScoreCreatedAt.value,
      tLSFGBoxScoreUpdatedAt.value,
    );

    return this.#teamLeagueSeasonFixtureGameBoxScoreRepository.save(teamLeagueSeasonFixtureGameBoxScore);
  }
}
