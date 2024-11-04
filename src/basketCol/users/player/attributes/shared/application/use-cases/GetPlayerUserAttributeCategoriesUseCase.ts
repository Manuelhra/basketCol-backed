import {
  IPlayerUserDefensiveAttributesRepository,
  IPlayerUserFinishingAttributesRepository,
  IPlayerUserPhysicalAttributesRepository,
  IPlayerUserReboundingAttributesRepository,
  IPlayerUserShootingAttributesRepository,
  IPlayerUserSkillAttributesRepository,
  PlayerUserId,
  PlayerUserValidationService,
  PUDAReferencedPlayerUserId,
  PUFAReferencedPlayerUserId,
  PUPAReferencedPlayerUserId,
  PURAReferencedPlayerUserId,
  PUShootingAttributesReferencedPlayerUserId,
  PUSASkillAttributesReferencedPlayerUserId,
} from '@basketcol/domain';

import { GetPlayerUserAttributeCategoriesDTO } from '../dtos/GetPlayerUserAttributeCategoriesDTO';
import {
  IGetPlayerUserAttributeCategoriesUseCase,
  IGetPlayerUserAttributeCategoriesUseCaseResponse,
} from './ports/IGetPlayerUserAttributeCategoriesUseCase';

type Dependencies = {
  readonly playerUserValidationService: PlayerUserValidationService;
  readonly playerUserDefensiveAttributesRepository: IPlayerUserDefensiveAttributesRepository;
  readonly playerUserFinishingAttributesRepository: IPlayerUserFinishingAttributesRepository;
  readonly playerUserPhysicalAttributesRepository: IPlayerUserPhysicalAttributesRepository;
  readonly playerUserReboundingAttributesRepository: IPlayerUserReboundingAttributesRepository;
  readonly playerUserShootingAttributesRepository: IPlayerUserShootingAttributesRepository;
  readonly playerUserSkillAttributesRepository: IPlayerUserSkillAttributesRepository;
};

export class GetPlayerUserAttributeCategoriesUseCase implements IGetPlayerUserAttributeCategoriesUseCase {
  readonly #playerUserValidationService: PlayerUserValidationService;

  readonly #playerUserDefensiveAttributesRepository: IPlayerUserDefensiveAttributesRepository;

  readonly #playerUserFinishingAttributesRepository: IPlayerUserFinishingAttributesRepository;

  readonly #playerUserPhysicalAttributesRepository: IPlayerUserPhysicalAttributesRepository;

  readonly #playerUserReboundingAttributesRepository: IPlayerUserReboundingAttributesRepository;

  readonly #playerUserShootingAttributesRepository: IPlayerUserShootingAttributesRepository;

  readonly #playerUserSkillAttributesRepository: IPlayerUserSkillAttributesRepository;

  private constructor(dependencies: Dependencies) {
    this.#playerUserValidationService = dependencies.playerUserValidationService;
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
    await this.#playerUserValidationService.ensurePlayerUserExists(playerUserId);
  }

  private createReferencedIds(playerId: string) {
    return {
      defensive: PUDAReferencedPlayerUserId.create(playerId),
      finishing: PUFAReferencedPlayerUserId.create(playerId),
      physical: PUPAReferencedPlayerUserId.create(playerId),
      rebounding: PURAReferencedPlayerUserId.create(playerId),
      shooting: PUShootingAttributesReferencedPlayerUserId.create(playerId),
      skill: PUSASkillAttributesReferencedPlayerUserId.create(playerId),
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
      this.#playerUserDefensiveAttributesRepository.searchByPlayerUserId(referencedIds.defensive),
      this.#playerUserFinishingAttributesRepository.searchByPlayerUserId(referencedIds.finishing),
      this.#playerUserPhysicalAttributesRepository.searchByPlayerUserId(referencedIds.physical),
      this.#playerUserReboundingAttributesRepository.searchByPlayerUserId(referencedIds.rebounding),
      this.#playerUserShootingAttributesRepository.searchByPlayerUserId(referencedIds.shooting),
      this.#playerUserSkillAttributesRepository.searchByPlayerUserId(referencedIds.skill),
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
