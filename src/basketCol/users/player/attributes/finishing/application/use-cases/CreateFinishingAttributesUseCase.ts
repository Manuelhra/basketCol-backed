import {
  BusinessDateDomainService,
  HostUserType,
  IdUniquenessValidatorDomainService,
  IPlayerUserFinishingAttributesPrimitives,
  IPlayerUserFinishingAttributesRepository,
  PlayerUserFinishingAttributes,
  PlayerUserValidationDomainService,
  PUFACreatedAt,
  PUFAId,
  PUFAPlayerUserId,
  PUFAUpdatedAt,
} from '@basketcol/domain';

import { CreateFinishingAttributesDTO } from '../dtos/CreateFinishingAttributesDTO';
import { ICreateFinishingAttributesUseCase } from './ports/ICreateFinishingAttributesUseCase';
import { IUserContext } from '../../../../../../shared/application/context/ports/IUserContext';
import { UnauthorizedAccessError } from '../../../../../../shared/application/exceptions/UnauthorizedAccessError';

type Dependencies = {
  idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  playerUserValidationDomainService: PlayerUserValidationDomainService;
  businessDateDomainService: BusinessDateDomainService;
  playerUserFinishingAttributesRepository: IPlayerUserFinishingAttributesRepository;
};

export class CreateFinishingAttributesUseCase implements ICreateFinishingAttributesUseCase {
  readonly #idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;

  readonly #playerUserValidationDomainService: PlayerUserValidationDomainService;

  readonly #businessDateDomainService: BusinessDateDomainService;

  readonly #playerUserFinishingAttributesRepository: IPlayerUserFinishingAttributesRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorDomainService = dependencies.idUniquenessValidatorDomainService;
    this.#playerUserValidationDomainService = dependencies.playerUserValidationDomainService;
    this.#businessDateDomainService = dependencies.businessDateDomainService;
    this.#playerUserFinishingAttributesRepository = dependencies.playerUserFinishingAttributesRepository;
  }

  public static create(dependencies: Dependencies): CreateFinishingAttributesUseCase {
    return new CreateFinishingAttributesUseCase(dependencies);
  }

  public async execute(dto: CreateFinishingAttributesDTO, userContext: IUserContext): Promise<void> {
    if (userContext.userType !== HostUserType.value) {
      throw UnauthorizedAccessError.create(userContext, HostUserType.value, 'create finishing attributes');
    }

    const {
      id,
      drivingLayup,
      drivingDunk,
      standingDunk,
      postControl,
      playerUserId,
    } = dto;

    const pUFAId: PUFAId = PUFAId.create(id);
    const pUFAPlayerUserId: PUFAPlayerUserId = PUFAPlayerUserId.create(playerUserId);

    await this.#idUniquenessValidatorDomainService.ensureUniqueId<PUFAId, IPlayerUserFinishingAttributesPrimitives, PlayerUserFinishingAttributes>(pUFAId);
    await this.#playerUserValidationDomainService.ensurePlayerUserExists(pUFAPlayerUserId);

    const pUFACreatedAt: PUFACreatedAt = this.#businessDateDomainService.getCurrentDate();
    const pUFAUpdatedAt: PUFAUpdatedAt = this.#businessDateDomainService.getCurrentDate();

    const playerUserFinishingAttributes: PlayerUserFinishingAttributes = PlayerUserFinishingAttributes.create(
      pUFAId.value,
      drivingLayup,
      drivingDunk,
      standingDunk,
      postControl,
      pUFAPlayerUserId.value,
      pUFACreatedAt.value,
      pUFAUpdatedAt.value,
    );

    return this.#playerUserFinishingAttributesRepository.save(playerUserFinishingAttributes);
  }
}
