import {
  BusinessDateService,
  IdUniquenessValidatorService,
  IPlayerUserShootingAttributes,
  IPlayerUserShootingAttributesRepository,
  PlayerUserShootingAttributes,
  PlayerUserValidationService,
  PUShootingAttributesCreatedAt,
  PUShootingAttributesId,
  PUShootingAttributesReferencedPlayerUserId,
  PUShootingAttributesUpdatedAt,
} from '@basketcol/domain';

import { CreateShootingAttributesDTO } from '../dtos/CreateShootingAttributesDTO';

export class CreateShootingAttributesUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #playerUserValidationService: PlayerUserValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #playerUserShootingAttributesRepository: IPlayerUserShootingAttributesRepository;

  constructor(dependencies: {
    idUniquenessValidatorService: IdUniquenessValidatorService;
    playerUserValidationService: PlayerUserValidationService;
    businessDateService: BusinessDateService;
    playerUserShootingAttributesRepository: IPlayerUserShootingAttributesRepository;
  }) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#playerUserValidationService = dependencies.playerUserValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#playerUserShootingAttributesRepository = dependencies.playerUserShootingAttributesRepository;
  }

  public async run(payload: CreateShootingAttributesDTO): Promise<void> {
    const {
      id,
      closeShot,
      midRangeShot,
      threePointShot,
      freeThrow,
      playerUserId,
    } = payload;

    const pUShootingAttributesId: PUShootingAttributesId = new PUShootingAttributesId(id);
    const pUShootingAttributesReferencedPlayerUserId: PUShootingAttributesReferencedPlayerUserId = new PUShootingAttributesReferencedPlayerUserId(playerUserId);

    await this.#idUniquenessValidatorService.ensureUniqueId<PUShootingAttributesId, IPlayerUserShootingAttributes, PlayerUserShootingAttributes>(pUShootingAttributesId);
    await this.#playerUserValidationService.ensurePlayerUserExists(pUShootingAttributesReferencedPlayerUserId.value);

    const pUShootingAttributesCreatedAt: PUShootingAttributesCreatedAt = this.#businessDateService.getCurrentDate();
    const pUShootingAttributesUpdatedAt: PUShootingAttributesUpdatedAt = this.#businessDateService.getCurrentDate();

    const playerUserShootingAttributes: PlayerUserShootingAttributes = new PlayerUserShootingAttributes(
      pUShootingAttributesId.value,
      closeShot,
      midRangeShot,
      threePointShot,
      freeThrow,
      pUShootingAttributesReferencedPlayerUserId.playerUserIdAsString,
      pUShootingAttributesCreatedAt.value,
      pUShootingAttributesUpdatedAt.value,
    );

    return this.#playerUserShootingAttributesRepository.save(playerUserShootingAttributes);
  }
}
