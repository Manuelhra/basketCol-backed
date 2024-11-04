import {
  BusinessDateService,
  IdUniquenessValidatorService,
  IPlayerUserDefensiveAttributesPrimitives,
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

type Dependencies = {
  readonly idUniquenessValidatorService: IdUniquenessValidatorService;
  readonly playerUserValidationService: PlayerUserValidationService;
  readonly businessDateService: BusinessDateService;
  readonly playerUserDefensiveAttributesRepository: IPlayerUserDefensiveAttributesRepository;
};

export class CreateDefensiveAttributesUseCase implements ICreateDefensiveAttributesUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #playerUserValidationService: PlayerUserValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #playerUserDefensiveAttributesRepository: IPlayerUserDefensiveAttributesRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#playerUserValidationService = dependencies.playerUserValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#playerUserDefensiveAttributesRepository = dependencies.playerUserDefensiveAttributesRepository;
  }

  public static create(dependencies: Dependencies): CreateDefensiveAttributesUseCase {
    return new CreateDefensiveAttributesUseCase(dependencies);
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

    const pUDAId: PUDAId = PUDAId.create(id);
    const pUDAReferencedPlayerUserId: PUDAReferencedPlayerUserId = PUDAReferencedPlayerUserId.create(playerUserId);

    await this.#idUniquenessValidatorService.ensureUniqueId<PUDAId, IPlayerUserDefensiveAttributesPrimitives, PlayerUserDefensiveAttributes>(pUDAId);
    await this.#playerUserValidationService.ensurePlayerUserExists(pUDAReferencedPlayerUserId.value);

    const pUDACreatedAt: PUDACreatedAt = this.#businessDateService.getCurrentDate();
    const pUDAUpdatedAt: PUDAUpdatedAt = this.#businessDateService.getCurrentDate();

    const playerUserDefensiveAttributes: PlayerUserDefensiveAttributes = PlayerUserDefensiveAttributes.create(
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
