import {
  BusinessDateService,
  HostUserType,
  IdUniquenessValidatorService,
  IPlayerUserPhysicalAttributesPrimitives,
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
import { IUserContext } from '../../../../../../shared/application/context/ports/IUserContext';
import { UnauthorizedAccessError } from '../../../../../../shared/application/exceptions/UnauthorizedAccessError';

type Dependencies = {
  idUniquenessValidatorService: IdUniquenessValidatorService;
  playerUserValidationService: PlayerUserValidationService;
  businessDateService: BusinessDateService;
  playerUserPhysicalAttributesRepository: IPlayerUserPhysicalAttributesRepository;
};

export class CreatePhysicalAttributesUseCase implements ICreatePhysicalAttributesUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #playerUserValidationService: PlayerUserValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #playerUserPhysicalAttributesRepository: IPlayerUserPhysicalAttributesRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#playerUserValidationService = dependencies.playerUserValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#playerUserPhysicalAttributesRepository = dependencies.playerUserPhysicalAttributesRepository;
  }

  public static create(dependencies: Dependencies): CreatePhysicalAttributesUseCase {
    return new CreatePhysicalAttributesUseCase(dependencies);
  }

  public async execute(dto: CreatePhysicalAttributesDTO, userContext: IUserContext): Promise<void> {
    if (userContext.userType !== HostUserType.value) {
      throw UnauthorizedAccessError.create(userContext, HostUserType.value, 'create physical attributes');
    }

    const {
      id,
      speed,
      acceleration,
      strength,
      vertical,
      stamina,
      playerUserId,
    } = dto;

    const physicalAttributesId: PUPAId = PUPAId.create(id);
    const pUPAReferencedPlayerUserId: PUPAReferencedPlayerUserId = PUPAReferencedPlayerUserId.create(playerUserId);

    await this.#idUniquenessValidatorService.ensureUniqueId<PUPAId, IPlayerUserPhysicalAttributesPrimitives, PlayerUserPhysicalAttributes>(physicalAttributesId);
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
