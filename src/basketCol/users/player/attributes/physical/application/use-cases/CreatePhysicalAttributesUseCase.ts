import {
  BusinessDateDomainService,
  HostUserType,
  IdUniquenessValidatorDomainService,
  IPlayerUserPhysicalAttributesPrimitives,
  IPlayerUserPhysicalAttributesRepository,
  PlayerUserPhysicalAttributes,
  PlayerUserValidationDomainService,
  PUPACreatedAt,
  PUPAId,
  PUPAPlayerUserId,
  PUPAUpdatedAt,
} from '@basketcol/domain';

import { CreatePhysicalAttributesDTO } from '../dtos/CreatePhysicalAttributesDTO';
import { ICreatePhysicalAttributesUseCase } from './ports/ICreatePhysicalAttributesUseCase';
import { IUserContext } from '../../../../../../shared/application/context/ports/IUserContext';
import { UnauthorizedAccessError } from '../../../../../../shared/application/exceptions/UnauthorizedAccessError';

type Dependencies = {
  idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  playerUserValidationDomainService: PlayerUserValidationDomainService;
  businessDateDomainService: BusinessDateDomainService;
  playerUserPhysicalAttributesRepository: IPlayerUserPhysicalAttributesRepository;
};

export class CreatePhysicalAttributesUseCase implements ICreatePhysicalAttributesUseCase {
  readonly #idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;

  readonly #playerUserValidationDomainService: PlayerUserValidationDomainService;

  readonly #businessDateDomainService: BusinessDateDomainService;

  readonly #playerUserPhysicalAttributesRepository: IPlayerUserPhysicalAttributesRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorDomainService = dependencies.idUniquenessValidatorDomainService;
    this.#playerUserValidationDomainService = dependencies.playerUserValidationDomainService;
    this.#businessDateDomainService = dependencies.businessDateDomainService;
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
    const pUPAPlayerUserId: PUPAPlayerUserId = PUPAPlayerUserId.create(playerUserId);

    await this.#idUniquenessValidatorDomainService.ensureUniqueId<PUPAId, IPlayerUserPhysicalAttributesPrimitives, PlayerUserPhysicalAttributes>(physicalAttributesId);
    await this.#playerUserValidationDomainService.ensurePlayerUserExists(pUPAPlayerUserId);

    const pUPACreatedAt: PUPACreatedAt = this.#businessDateDomainService.getCurrentDate();
    const pUPAUpdatedAt: PUPAUpdatedAt = this.#businessDateDomainService.getCurrentDate();

    const playerUserPhysicalAttributes: PlayerUserPhysicalAttributes = PlayerUserPhysicalAttributes.create(
      physicalAttributesId.value,
      speed,
      acceleration,
      strength,
      vertical,
      stamina,
      pUPAPlayerUserId.value,
      pUPACreatedAt.value,
      pUPAUpdatedAt.value,
    );

    return this.#playerUserPhysicalAttributesRepository.save(playerUserPhysicalAttributes);
  }
}
