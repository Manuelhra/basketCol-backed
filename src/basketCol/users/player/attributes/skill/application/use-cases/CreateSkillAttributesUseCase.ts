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
import { ICreateSkillAttributesUseCase } from './ports/ICreateSkillAttributesUseCase';

export class CreateSkillAttributesUseCase implements ICreateSkillAttributesUseCase {
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

  public async execute(dto: CreateSkillAttributesDTO): Promise<void> {
    const {
      id,
      passAccuracy,
      ballHandle,
      speedWithBall,
      playerUserId,
    } = dto;

    const pUSASkillAttributesId: PUSASkillAttributesId = PUSASkillAttributesId.create(id);
    const pUSASkillAttributesReferencedPlayerUserId: PUSASkillAttributesReferencedPlayerUserId = PUSASkillAttributesReferencedPlayerUserId.create(playerUserId);

    await this.#idUniquenessValidatorService.ensureUniqueId<PUSASkillAttributesId, IPlayerUserSkillAttributes, PlayerUserSkillAttributes>(pUSASkillAttributesId);
    await this.#playerUserValidationService.ensurePlayerUserExists(pUSASkillAttributesReferencedPlayerUserId.value);

    const pUSASkillAttributesCreatedAt: PUSASkillAttributesCreatedAt = this.#businessDateService.getCurrentDate();
    const pUSASkillAttributesUpdatedAt: PUSASkillAttributesUpdatedAt = this.#businessDateService.getCurrentDate();

    const playerUserSkillAttributes: PlayerUserSkillAttributes = PlayerUserSkillAttributes.create(
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
