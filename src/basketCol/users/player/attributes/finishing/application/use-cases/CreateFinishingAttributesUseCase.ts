import {
  BusinessDateService,
  IdUniquenessValidatorService,
  IPlayerUserFinishingAttributes,
  IPlayerUserFinishingAttributesRepository,
  PlayerUserFinishingAttributes,
  PlayerUserValidationService,
  PUFACreatedAt,
  PUFAId,
  PUFAReferencedPlayerUserId,
  PUFAUpdatedAt,
} from '@basketcol/domain';

import { CreateFinishingAttributesDTO } from '../dtos/CreateFinishingAttributesDTO';
import { ICreateFinishingAttributesUseCase } from './ports/ICreateFinishingAttributesUseCase';

export class CreateFinishingAttributesUseCase implements ICreateFinishingAttributesUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #playerUserValidationService: PlayerUserValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #playerUserFinishingAttributesRepository: IPlayerUserFinishingAttributesRepository;

  constructor(dependencies: {
    idUniquenessValidatorService: IdUniquenessValidatorService;
    playerUserValidationService: PlayerUserValidationService;
    businessDateService: BusinessDateService;
    playerUserFinishingAttributesRepository: IPlayerUserFinishingAttributesRepository;
  }) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#playerUserValidationService = dependencies.playerUserValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#playerUserFinishingAttributesRepository = dependencies.playerUserFinishingAttributesRepository;
  }

  public async execute(dto: CreateFinishingAttributesDTO): Promise<void> {
    const {
      id,
      drivingLayup,
      drivingDunk,
      standingDunk,
      postControl,
      playerUserId,
    } = dto;

    const pUFAId: PUFAId = new PUFAId(id);
    const pUFAReferencedPlayerUserId: PUFAReferencedPlayerUserId = new PUFAReferencedPlayerUserId(playerUserId);

    await this.#idUniquenessValidatorService.ensureUniqueId<PUFAId, IPlayerUserFinishingAttributes, PlayerUserFinishingAttributes>(pUFAId);
    await this.#playerUserValidationService.ensurePlayerUserExists(pUFAReferencedPlayerUserId.value);

    const pUFACreatedAt: PUFACreatedAt = this.#businessDateService.getCurrentDate();
    const pUFAUpdatedAt: PUFAUpdatedAt = this.#businessDateService.getCurrentDate();

    const playerUserFinishingAttributes: PlayerUserFinishingAttributes = new PlayerUserFinishingAttributes(
      pUFAId.value,
      drivingLayup,
      drivingDunk,
      standingDunk,
      postControl,
      pUFAReferencedPlayerUserId.playerUserIdAsString,
      pUFACreatedAt.value,
      pUFAUpdatedAt.value,
    );

    return this.#playerUserFinishingAttributesRepository.save(playerUserFinishingAttributes);
  }
}
