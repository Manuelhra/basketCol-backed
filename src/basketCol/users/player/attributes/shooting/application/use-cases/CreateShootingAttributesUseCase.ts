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
import { ICreateShootingAttributesUseCase } from './ports/ICreateShootingAttributesUseCase';

type Dependencies = {
  idUniquenessValidatorService: IdUniquenessValidatorService;
  playerUserValidationService: PlayerUserValidationService;
  businessDateService: BusinessDateService;
  playerUserShootingAttributesRepository: IPlayerUserShootingAttributesRepository;
};

export class CreateShootingAttributesUseCase implements ICreateShootingAttributesUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #playerUserValidationService: PlayerUserValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #playerUserShootingAttributesRepository: IPlayerUserShootingAttributesRepository;

  constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#playerUserValidationService = dependencies.playerUserValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#playerUserShootingAttributesRepository = dependencies.playerUserShootingAttributesRepository;
  }

  public async execute(dto: CreateShootingAttributesDTO): Promise<void> {
    const {
      id,
      closeShot,
      midRangeShot,
      threePointShot,
      freeThrow,
      playerUserId,
    } = dto;

    const pUShootingAttributesId: PUShootingAttributesId = PUShootingAttributesId.create(id);
    const pUShootingAttributesReferencedPlayerUserId: PUShootingAttributesReferencedPlayerUserId = PUShootingAttributesReferencedPlayerUserId.create(playerUserId);

    await this.#idUniquenessValidatorService.ensureUniqueId<PUShootingAttributesId, IPlayerUserShootingAttributes, PlayerUserShootingAttributes>(pUShootingAttributesId);
    await this.#playerUserValidationService.ensurePlayerUserExists(pUShootingAttributesReferencedPlayerUserId.value);

    const pUShootingAttributesCreatedAt: PUShootingAttributesCreatedAt = this.#businessDateService.getCurrentDate();
    const pUShootingAttributesUpdatedAt: PUShootingAttributesUpdatedAt = this.#businessDateService.getCurrentDate();

    const playerUserShootingAttributes: PlayerUserShootingAttributes = PlayerUserShootingAttributes.create(
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
