import {
  BusinessDateService,
  IdUniquenessValidatorService,
  ITeamPrimitives,
  ITeamRepository,
  Team,
  TeamCreatedAt,
  TeamId,
  TeamUpdatedAt,
  TeamFounderUserValidationService,
  TReferencedTeamFounderUserId,
} from '@basketcol/domain';

import { CreateTeamDTO } from '../dtos/CreateTeamDTO';
import { ICreateTeamUseCase } from './ports/ICreateTeamUseCase';

type Dependencies = {
  idUniquenessValidatorService: IdUniquenessValidatorService;
  teamFounderUserValidationService: TeamFounderUserValidationService;
  businessDateService: BusinessDateService;
  teamRepository: ITeamRepository;
};

export class CreateTeamUseCase implements ICreateTeamUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #teamFounderUserValidationService: TeamFounderUserValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #teamRepository: ITeamRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#teamFounderUserValidationService = dependencies.teamFounderUserValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#teamRepository = dependencies.teamRepository;
  }

  public static create(dependencies: Dependencies): CreateTeamUseCase {
    return new CreateTeamUseCase(dependencies);
  }

  public async execute(dto: CreateTeamDTO): Promise<void> {
    const {
      id,
      officialName,
      teamFounderUserId,
    } = dto;

    const teamId: TeamId = TeamId.create(id);
    const tReferencedTeamFounderUserId: TReferencedTeamFounderUserId = TReferencedTeamFounderUserId.create(teamFounderUserId);

    await this.#idUniquenessValidatorService.ensureUniqueId<TeamId, ITeamPrimitives, Team>(teamId);
    await this.#teamFounderUserValidationService.ensureTeamFounderUserExists(tReferencedTeamFounderUserId.value);

    const teamCreatedAt: TeamCreatedAt = this.#businessDateService.getCurrentDate();
    const teamUpdatedAt: TeamUpdatedAt = this.#businessDateService.getCurrentDate();

    const team: Team = Team.create(
      teamId.value,
      officialName,
      tReferencedTeamFounderUserId.teamFounderUserIdAsString,
      teamCreatedAt.value,
      teamUpdatedAt.value,
    );

    return this.#teamRepository.save(team);
  }
}
