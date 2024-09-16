import {
  BusinessDateService,
  IdUniquenessValidatorService,
  IPlayerUserPhysicalAttributes,
  IPlayerUserPhysicalAttributesRepository,
  PlayerUserPhysicalAttributes,
  PlayerUserValidationService,
  PUPACreatedAt,
  PUPAId,
  PUPAReferencedPlayerUserId,
  PUPAUpdatedAt,
} from '@basketcol/domain';

import { CreatePhysicalAttributesDTO } from '../dtos/CreatePhysicalAttributesDTO';
import { ICreatePhysicalAttributesUseCase } from './ports/ICreatePhysicalAttributesUseCase';

export class CreatePhysicalAttributesUseCase implements ICreatePhysicalAttributesUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #playerUserValidationService: PlayerUserValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #playerUserPhysicalAttributesRepository: IPlayerUserPhysicalAttributesRepository;

  constructor(dependencies: {
    idUniquenessValidatorService: IdUniquenessValidatorService;
    playerUserValidationService: PlayerUserValidationService;
    businessDateService: BusinessDateService;
    playerUserPhysicalAttributesRepository: IPlayerUserPhysicalAttributesRepository;
  }) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#playerUserValidationService = dependencies.playerUserValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#playerUserPhysicalAttributesRepository = dependencies.playerUserPhysicalAttributesRepository;
  }

  public async execute(dto: CreatePhysicalAttributesDTO): Promise<void> {
    const {
      id,
      speed,
      acceleration,
      strength,
      vertical,
      stamina,
      playerUserId,
    } = dto;

    const physicalAttributesId: PUPAId = new PUPAId(id);
    const pUPAReferencedPlayerUserId: PUPAReferencedPlayerUserId = new PUPAReferencedPlayerUserId(playerUserId);

    await this.#idUniquenessValidatorService.ensureUniqueId<PUPAId, IPlayerUserPhysicalAttributes, PlayerUserPhysicalAttributes>(physicalAttributesId);
    await this.#playerUserValidationService.ensurePlayerUserExists(pUPAReferencedPlayerUserId.value);

    const pUPACreatedAt: PUPACreatedAt = this.#businessDateService.getCurrentDate();
    const pUPAUpdatedAt: PUPAUpdatedAt = this.#businessDateService.getCurrentDate();

    const playerUserPhysicalAttributes: PlayerUserPhysicalAttributes = PlayerUserPhysicalAttributes.create(
      physicalAttributesId.value,
      speed,
      acceleration,
      strength,
      vertical,
      stamina,
      pUPAReferencedPlayerUserId.playerUserIdAsString,
      pUPACreatedAt.value,
      pUPAUpdatedAt.value,
    );

    return this.#playerUserPhysicalAttributesRepository.save(playerUserPhysicalAttributes);
  }
}
