import {
  IPlayerUserDefensiveAttributesRepository,
  IPlayerUserFinishingAttributesRepository,
  IPlayerUserPhysicalAttributesRepository,
  IPlayerUserReboundingAttributesRepository,
  IPlayerUserShootingAttributesRepository,
  IPlayerUserSkillAttributesRepository,
  PlayerUserId,
  PlayerUserValidationDomainService,
  PUDAPlayerUserId,
  PUFAPlayerUserId,
  PUPAPlayerUserId,
  PURAPlayerUserId,
  PUShootingAttributesPlayerUserId,
  PUSASkillAttributesPlayerUserId,
} from '@basketcol/domain';

import { GetPlayerUserAttributeCategoriesDTO } from '../dtos/GetPlayerUserAttributeCategoriesDTO';
import {
  IGetPlayerUserAttributeCategoriesUseCase,
  IGetPlayerUserAttributeCategoriesUseCaseResponse,
} from './ports/IGetPlayerUserAttributeCategoriesUseCase';

type Dependencies = {
  readonly playerUserValidationDomainService: PlayerUserValidationDomainService;
  readonly playerUserDefensiveAttributesRepository: IPlayerUserDefensiveAttributesRepository;
  readonly playerUserFinishingAttributesRepository: IPlayerUserFinishingAttributesRepository;
  readonly playerUserPhysicalAttributesRepository: IPlayerUserPhysicalAttributesRepository;
  readonly playerUserReboundingAttributesRepository: IPlayerUserReboundingAttributesRepository;
  readonly playerUserShootingAttributesRepository: IPlayerUserShootingAttributesRepository;
  readonly playerUserSkillAttributesRepository: IPlayerUserSkillAttributesRepository;
};

export class GetPlayerUserAttributeCategoriesUseCase implements IGetPlayerUserAttributeCategoriesUseCase {
  readonly #playerUserValidationDomainService: PlayerUserValidationDomainService;

  readonly #playerUserDefensiveAttributesRepository: IPlayerUserDefensiveAttributesRepository;

  readonly #playerUserFinishingAttributesRepository: IPlayerUserFinishingAttributesRepository;

  readonly #playerUserPhysicalAttributesRepository: IPlayerUserPhysicalAttributesRepository;

  readonly #playerUserReboundingAttributesRepository: IPlayerUserReboundingAttributesRepository;

  readonly #playerUserShootingAttributesRepository: IPlayerUserShootingAttributesRepository;

  readonly #playerUserSkillAttributesRepository: IPlayerUserSkillAttributesRepository;

  private constructor(dependencies: Dependencies) {
    this.#playerUserValidationDomainService = dependencies.playerUserValidationDomainService;
    this.#playerUserDefensiveAttributesRepository = dependencies.playerUserDefensiveAttributesRepository;
    this.#playerUserFinishingAttributesRepository = dependencies.playerUserFinishingAttributesRepository;
    this.#playerUserPhysicalAttributesRepository = dependencies.playerUserPhysicalAttributesRepository;
    this.#playerUserReboundingAttributesRepository = dependencies.playerUserReboundingAttributesRepository;
    this.#playerUserShootingAttributesRepository = dependencies.playerUserShootingAttributesRepository;
    this.#playerUserSkillAttributesRepository = dependencies.playerUserSkillAttributesRepository;
  }

  public static create(dependencies: Dependencies): GetPlayerUserAttributeCategoriesUseCase {
    return new GetPlayerUserAttributeCategoriesUseCase(dependencies);
  }

  public async execute(dto: GetPlayerUserAttributeCategoriesDTO): Promise<IGetPlayerUserAttributeCategoriesUseCaseResponse> {
    await this.#validateAndGetPlayerId(dto.playerUserId);
    const referencedIds = this.createReferencedIds(dto.playerUserId);

    return this.#fetchAllAttributes(referencedIds);
  }

  async #validateAndGetPlayerId(id: string): Promise<void> {
    const playerUserId = PlayerUserId.create(id);
    await this.#playerUserValidationDomainService.ensurePlayerUserExists(playerUserId);
  }

  private createReferencedIds(playerId: string) {
    return {
      defensive: PUDAPlayerUserId.create(playerId),
      finishing: PUFAPlayerUserId.create(playerId),
      physical: PUPAPlayerUserId.create(playerId),
      rebounding: PURAPlayerUserId.create(playerId),
      shooting: PUShootingAttributesPlayerUserId.create(playerId),
      skill: PUSASkillAttributesPlayerUserId.create(playerId),
    };
  }

  async #fetchAllAttributes(referencedIds: ReturnType<typeof this.createReferencedIds>): Promise<IGetPlayerUserAttributeCategoriesUseCaseResponse> {
    const [
      defensiveAttributes,
      finishingAttributes,
      physicalAttributes,
      reboundingAttributes,
      shootingAttributes,
      skillAttributes,
    ] = await Promise.all([
      this.#playerUserDefensiveAttributesRepository.findByPlayerUserId(referencedIds.defensive),
      this.#playerUserFinishingAttributesRepository.findByPlayerUserId(referencedIds.finishing),
      this.#playerUserPhysicalAttributesRepository.findByPlayerUserId(referencedIds.physical),
      this.#playerUserReboundingAttributesRepository.findByPlayerUserId(referencedIds.rebounding),
      this.#playerUserShootingAttributesRepository.findByPlayerUserId(referencedIds.shooting),
      this.#playerUserSkillAttributesRepository.findByPlayerUserId(referencedIds.skill),
    ]);

    return {
      defensiveAttributes,
      finishingAttributes,
      physicalAttributes,
      reboundingAttributes,
      shootingAttributes,
      skillAttributes,
    };
  }
}
