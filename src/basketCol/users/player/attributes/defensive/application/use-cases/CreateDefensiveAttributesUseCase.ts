import {
  BusinessDateService,
  IdUniquenessValidatorService,
  IPlayerUserDefensiveAttributes,
  IPlayerUserDefensiveAttributesRepository,
  PlayerUserDefensiveAttributes,
  PlayerUserValidationService,
  PUDACreatedAt,
  PUDAId,
  PUDAReferencedPlayerUserId,
  PUDAUpdatedAt,
} from '@basketcol/domain';

import { CreateDefensiveAttributesDTO } from '../dtos/CreateDefensiveAttributesDTO';
import { ICreateDefensiveAttributesUseCase } from './ports/ICreateDefensiveAttributesUseCase';

export class CreateDefensiveAttributesUseCase implements ICreateDefensiveAttributesUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #playerUserValidationService: PlayerUserValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #playerUserDefensiveAttributesRepository: IPlayerUserDefensiveAttributesRepository;

  constructor(dependencies: {
    idUniquenessValidatorService: IdUniquenessValidatorService;
    playerUserValidationService: PlayerUserValidationService;
    businessDateService: BusinessDateService;
    playerUserDefensiveAttributesRepository: IPlayerUserDefensiveAttributesRepository;
  }) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#playerUserValidationService = dependencies.playerUserValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#playerUserDefensiveAttributesRepository = dependencies.playerUserDefensiveAttributesRepository;
  }

  public async execute(dto: CreateDefensiveAttributesDTO): Promise<void> {
    const {
      id,
      interiorDefense,
      perimeterDefense,
      steal,
      block,
      playerUserId,
    } = dto;

    const pUDAId: PUDAId = new PUDAId(id);
    const pUDAReferencedPlayerUserId: PUDAReferencedPlayerUserId = new PUDAReferencedPlayerUserId(playerUserId);

    await this.#idUniquenessValidatorService.ensureUniqueId<PUDAId, IPlayerUserDefensiveAttributes, PlayerUserDefensiveAttributes>(pUDAId);
    await this.#playerUserValidationService.ensurePlayerUserExists(pUDAReferencedPlayerUserId.value);

    const pUDACreatedAt: PUDACreatedAt = this.#businessDateService.getCurrentDate();
    const pUDAUpdatedAt: PUDAUpdatedAt = this.#businessDateService.getCurrentDate();

    const playerUserDefensiveAttributes: PlayerUserDefensiveAttributes = new PlayerUserDefensiveAttributes(
      pUDAId.value,
      interiorDefense,
      perimeterDefense,
      steal,
      block,
      pUDAReferencedPlayerUserId.playerUserIdAsString,
      pUDACreatedAt.value,
      pUDAUpdatedAt.value,
    );

    return this.#playerUserDefensiveAttributesRepository.save(playerUserDefensiveAttributes);
  }
}
