import {
  IdUniquenessValidatorDomainService,
  PlayerUserValidationDomainService,
  BusinessDateDomainService,
  IPlayerUserReboundingAttributesRepository,
  PlayerUserReboundingAttributes,
  PURAId,
  PURAPlayerUserId,
  IPlayerUserReboundingAttributesPrimitives,
  PURACreatedAt,
  PURAUpdatedAt,
  HostUserType,
} from '@basketcol/domain';

import { CreateReboundingAttributesDTO } from '../dtos/CreateReboundingAttributesDTO';
import { ICreateReboundingAttributesUseCase } from './ports/ICreateReboundingAttributesUseCase';
import { IUserContext } from '../../../../../../shared/application/context/ports/IUserContext';
import { UnauthorizedAccessError } from '../../../../../../shared/application/exceptions/UnauthorizedAccessError';

type Dependencies = {
  idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  playerUserValidationDomainService: PlayerUserValidationDomainService;
  businessDateDomainService: BusinessDateDomainService;
  playerUserReboundingAttributesRepository: IPlayerUserReboundingAttributesRepository;
};

export class CreateReboundingAttributesUseCase implements ICreateReboundingAttributesUseCase {
  readonly #idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;

  readonly #playerUserValidationDomainService: PlayerUserValidationDomainService;

  readonly #businessDateDomainService: BusinessDateDomainService;

  readonly #playerUserReboundingAttributesRepository: IPlayerUserReboundingAttributesRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorDomainService = dependencies.idUniquenessValidatorDomainService;
    this.#playerUserValidationDomainService = dependencies.playerUserValidationDomainService;
    this.#businessDateDomainService = dependencies.businessDateDomainService;
    this.#playerUserReboundingAttributesRepository = dependencies.playerUserReboundingAttributesRepository;
  }

  public static create(dependencies: Dependencies): CreateReboundingAttributesUseCase {
    return new CreateReboundingAttributesUseCase(dependencies);
  }

  public async execute(dto: CreateReboundingAttributesDTO, userContext: IUserContext): Promise<void> {
    if (userContext.userType !== HostUserType.value) {
      throw UnauthorizedAccessError.create(userContext, HostUserType.value, 'create rebounding attributes');
    }

    const {
      id,
      offensiveRebound,
      defensiveRebound,
      playerUserId,
    } = dto;

    const playerUserReboundingAttributesId: PURAId = PURAId.create(id);
    const pURAPlayerUserId: PURAPlayerUserId = PURAPlayerUserId.create(playerUserId);

    await this.#idUniquenessValidatorDomainService.ensureUniqueId<PURAId, IPlayerUserReboundingAttributesPrimitives, PlayerUserReboundingAttributes>(playerUserReboundingAttributesId);
    await this.#playerUserValidationDomainService.ensurePlayerUserExists(pURAPlayerUserId);

    const pURACreatedAt: PURACreatedAt = this.#businessDateDomainService.getCurrentDate();
    const pURAUpdatedAt: PURAUpdatedAt = this.#businessDateDomainService.getCurrentDate();

    const playerUserReboundingAttributes: PlayerUserReboundingAttributes = PlayerUserReboundingAttributes.create(
      playerUserReboundingAttributesId.value,
      offensiveRebound,
      defensiveRebound,
      pURAPlayerUserId.value,
      pURACreatedAt.value,
      pURAUpdatedAt.value,
    );

    return this.#playerUserReboundingAttributesRepository.save(playerUserReboundingAttributes);
  }
}
