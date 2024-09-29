import {
  BusinessDateService,
  IdUniquenessValidatorService,
  IPlayerUserFinishingAttributesPrimitives,
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

type Dependencies = {
  idUniquenessValidatorService: IdUniquenessValidatorService;
  playerUserValidationService: PlayerUserValidationService;
  businessDateService: BusinessDateService;
  playerUserFinishingAttributesRepository: IPlayerUserFinishingAttributesRepository;
};

export class CreateFinishingAttributesUseCase implements ICreateFinishingAttributesUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #playerUserValidationService: PlayerUserValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #playerUserFinishingAttributesRepository: IPlayerUserFinishingAttributesRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#playerUserValidationService = dependencies.playerUserValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#playerUserFinishingAttributesRepository = dependencies.playerUserFinishingAttributesRepository;
  }

  public static create(dependencies: Dependencies): CreateFinishingAttributesUseCase {
    return new CreateFinishingAttributesUseCase(dependencies);
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

    const pUFAId: PUFAId = PUFAId.create(id);
    const pUFAReferencedPlayerUserId: PUFAReferencedPlayerUserId = PUFAReferencedPlayerUserId.create(playerUserId);

    await this.#idUniquenessValidatorService.ensureUniqueId<PUFAId, IPlayerUserFinishingAttributesPrimitives, PlayerUserFinishingAttributes>(pUFAId);
    await this.#playerUserValidationService.ensurePlayerUserExists(pUFAReferencedPlayerUserId.value);

    const pUFACreatedAt: PUFACreatedAt = this.#businessDateService.getCurrentDate();
    const pUFAUpdatedAt: PUFAUpdatedAt = this.#businessDateService.getCurrentDate();

    const playerUserFinishingAttributes: PlayerUserFinishingAttributes = PlayerUserFinishingAttributes.create(
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
