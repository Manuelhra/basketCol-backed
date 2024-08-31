import {
  BusinessDateService,
  IdUniquenessValidatorService,
  ITeam,
  ITeamRepository,
  Team,
  TeamCreatedAt,
  TeamId,
  TeamUpdatedAt,
  TFUValidationService,
  TReferencedTeamFounderUserId,
} from '@basketcol/domain';

import { CreateTeamDTO } from '../dtos/CreateTeamDTO';

export class CreateTeamUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #tFUValidationService: TFUValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #teamRepository: ITeamRepository;

  constructor(dependencies: {
    idUniquenessValidatorService: IdUniquenessValidatorService;
    tFUValidationService: TFUValidationService;
    businessDateService: BusinessDateService;
    teamRepository: ITeamRepository;
  }) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#tFUValidationService = dependencies.tFUValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#teamRepository = dependencies.teamRepository;
  }

  public async run(payload: CreateTeamDTO): Promise<void> {
    const {
      id,
      officialName,
      teamFounderUserId,
    } = payload;

    const teamId: TeamId = new TeamId(id);
    const tReferencedTeamFounderUserId: TReferencedTeamFounderUserId = new TReferencedTeamFounderUserId(teamFounderUserId);

    await this.#idUniquenessValidatorService.ensureUniqueId<TeamId, ITeam, Team>(teamId);
    await this.#tFUValidationService.ensureTeamFounderUserExists(tReferencedTeamFounderUserId.value);

    const teamCreatedAt: TeamCreatedAt = this.#businessDateService.getCurrentDate();
    const teamUpdatedAt: TeamUpdatedAt = this.#businessDateService.getCurrentDate();

    const team: Team = new Team(
      teamId.value,
      officialName,
      tReferencedTeamFounderUserId.teamFounderUserIdAsString,
      teamCreatedAt.value,
      teamUpdatedAt.value,
    );

    return this.#teamRepository.save(team);
  }
}
