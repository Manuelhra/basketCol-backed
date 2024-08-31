import {
  BusinessDateService,
  IdUniquenessValidatorService,
  IPlayerUserSkillAttributes,
  IPlayerUserSkillAttributesRepository,
  PlayerUserSkillAttributes,
  PlayerUserValidationService,
  PUSASkillAttributesCreatedAt,
  PUSASkillAttributesId,
  PUSASkillAttributesReferencedPlayerUserId,
  PUSASkillAttributesUpdatedAt,
} from '@basketcol/domain';

import { CreateSkillAttributesDTO } from '../dtos/CreateSkillAttributesDTO';

export class CreateSkillAttributesUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #playerUserValidationService: PlayerUserValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #playerUserSkillAttributesRepository: IPlayerUserSkillAttributesRepository;

  constructor(dependencies: {
    idUniquenessValidatorService: IdUniquenessValidatorService;
    playerUserValidationService: PlayerUserValidationService;
    businessDateService: BusinessDateService;
    playerUserSkillAttributesRepository: IPlayerUserSkillAttributesRepository;
  }) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#playerUserValidationService = dependencies.playerUserValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#playerUserSkillAttributesRepository = dependencies.playerUserSkillAttributesRepository;
  }

  public async run(payload: CreateSkillAttributesDTO): Promise<void> {
    const {
      id,
      passAccuracy,
      ballHandle,
      speedWithBall,
      playerUserId,
    } = payload;

    const pUSASkillAttributesId: PUSASkillAttributesId = new PUSASkillAttributesId(id);
    const pUSASkillAttributesReferencedPlayerUserId: PUSASkillAttributesReferencedPlayerUserId = new PUSASkillAttributesReferencedPlayerUserId(playerUserId);

    await this.#idUniquenessValidatorService.ensureUniqueId<PUSASkillAttributesId, IPlayerUserSkillAttributes, PlayerUserSkillAttributes>(pUSASkillAttributesId);
    await this.#playerUserValidationService.ensurePlayerUserExists(pUSASkillAttributesReferencedPlayerUserId.value);

    const pUSASkillAttributesCreatedAt: PUSASkillAttributesCreatedAt = this.#businessDateService.getCurrentDate();
    const pUSASkillAttributesUpdatedAt: PUSASkillAttributesUpdatedAt = this.#businessDateService.getCurrentDate();

    const playerUserSkillAttributes: PlayerUserSkillAttributes = new PlayerUserSkillAttributes(
      pUSASkillAttributesId.value,
      passAccuracy,
      ballHandle,
      speedWithBall,
      pUSASkillAttributesReferencedPlayerUserId.playerUserIdAsString,
      pUSASkillAttributesCreatedAt.value,
      pUSASkillAttributesUpdatedAt.value,
    );

    return this.#playerUserSkillAttributesRepository.save(playerUserSkillAttributes);
  }
}
