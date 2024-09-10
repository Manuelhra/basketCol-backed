import {
  IdUniquenessValidatorService,
  PlayerUserValidationService,
  BusinessDateService,
  IPlayerUserReboundingAttributesRepository,
  PlayerUserReboundingAttributes,
  PURAId,
  PURAReferencedPlayerUserId,
  IPlayerUserReboundingAttributes,
  PURACreatedAt,
  PURAUpdatedAt,
} from '@basketcol/domain';

import { CreateReboundingAttributesDTO } from '../dtos/CreateReboundingAttributesDTO';
import { ICreateReboundingAttributesUseCase } from './ports/ICreateReboundingAttributesUseCase';

export class CreateReboundingAttributesUseCase implements ICreateReboundingAttributesUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #playerUserValidationService: PlayerUserValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #playerUserReboundingAttributesRepository: IPlayerUserReboundingAttributesRepository;

  constructor(dependencies: {
    idUniquenessValidatorService: IdUniquenessValidatorService;
    playerUserValidationService: PlayerUserValidationService;
    businessDateService: BusinessDateService;
    playerUserReboundingAttributesRepository: IPlayerUserReboundingAttributesRepository;
  }) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#playerUserValidationService = dependencies.playerUserValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#playerUserReboundingAttributesRepository = dependencies.playerUserReboundingAttributesRepository;
  }

  public async execute(dto: CreateReboundingAttributesDTO): Promise<void> {
    const {
      id,
      offensiveRebound,
      defensiveRebound,
      playerUserId,
    } = dto;

    const playerUserReboundingAttributesId: PURAId = new PURAId(id);
    const pURAReferencedPlayerUserId: PURAReferencedPlayerUserId = new PURAReferencedPlayerUserId(playerUserId);

    await this.#idUniquenessValidatorService.ensureUniqueId<PURAId, IPlayerUserReboundingAttributes, PlayerUserReboundingAttributes>(playerUserReboundingAttributesId);
    await this.#playerUserValidationService.ensurePlayerUserExists(pURAReferencedPlayerUserId.value);

    const pURACreatedAt: PURACreatedAt = this.#businessDateService.getCurrentDate();
    const pURAUpdatedAt: PURAUpdatedAt = this.#businessDateService.getCurrentDate();

    const playerUserReboundingAttributes: PlayerUserReboundingAttributes = new PlayerUserReboundingAttributes(
      playerUserReboundingAttributesId.value,
      offensiveRebound,
      defensiveRebound,
      pURAReferencedPlayerUserId.playerUserIdAsString,
      pURACreatedAt.value,
      pURAUpdatedAt.value,
    );

    return this.#playerUserReboundingAttributesRepository.save(playerUserReboundingAttributes);
  }
}
