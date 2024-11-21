import {
  BusinessDateDomainService,
  HostUserType,
  IdUniquenessValidatorDomainService,
  IPlayerUserDefensiveAttributesPrimitives,
  IPlayerUserDefensiveAttributesRepository,
  PlayerUserDefensiveAttributes,
  PlayerUserValidationDomainService,
  PUDACreatedAt,
  PUDAId,
  PUDAPlayerUserId,
  PUDAUpdatedAt,
} from '@basketcol/domain';

import { CreateDefensiveAttributesDTO } from '../dtos/CreateDefensiveAttributesDTO';
import { ICreateDefensiveAttributesUseCase } from './ports/ICreateDefensiveAttributesUseCase';
import { IUserContext } from '../../../../../../shared/application/context/ports/IUserContext';
import { UnauthorizedAccessError } from '../../../../../../shared/application/exceptions/UnauthorizedAccessError';

type Dependencies = {
  readonly idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  readonly playerUserValidationDomainService: PlayerUserValidationDomainService;
  readonly businessDateDomainService: BusinessDateDomainService;
  readonly playerUserDefensiveAttributesRepository: IPlayerUserDefensiveAttributesRepository;
};

export class CreateDefensiveAttributesUseCase implements ICreateDefensiveAttributesUseCase {
  readonly #idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;

  readonly #playerUserValidationDomainService: PlayerUserValidationDomainService;

  readonly #businessDateDomainService: BusinessDateDomainService;

  readonly #playerUserDefensiveAttributesRepository: IPlayerUserDefensiveAttributesRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorDomainService = dependencies.idUniquenessValidatorDomainService;
    this.#playerUserValidationDomainService = dependencies.playerUserValidationDomainService;
    this.#businessDateDomainService = dependencies.businessDateDomainService;
    this.#playerUserDefensiveAttributesRepository = dependencies.playerUserDefensiveAttributesRepository;
  }

  public static create(dependencies: Dependencies): CreateDefensiveAttributesUseCase {
    return new CreateDefensiveAttributesUseCase(dependencies);
  }

  public async execute(dto: CreateDefensiveAttributesDTO, userContext: IUserContext): Promise<void> {
    if (userContext.userType !== HostUserType.value) {
      throw UnauthorizedAccessError.create(userContext, HostUserType.value, 'create defensive attributes');
    }

    const {
      id,
      interiorDefense,
      perimeterDefense,
      steal,
      block,
      playerUserId,
    } = dto;

    const pUDAId: PUDAId = PUDAId.create(id);
    const pUDAPlayerUserId: PUDAPlayerUserId = PUDAPlayerUserId.create(playerUserId);

    await this.#idUniquenessValidatorDomainService.ensureUniqueId<PUDAId, IPlayerUserDefensiveAttributesPrimitives, PlayerUserDefensiveAttributes>(pUDAId);
    await this.#playerUserValidationDomainService.ensurePlayerUserExists(pUDAPlayerUserId);

    const pUDACreatedAt: PUDACreatedAt = this.#businessDateDomainService.getCurrentDate();
    const pUDAUpdatedAt: PUDAUpdatedAt = this.#businessDateDomainService.getCurrentDate();

    const playerUserDefensiveAttributes: PlayerUserDefensiveAttributes = PlayerUserDefensiveAttributes.create(
      pUDAId.value,
      interiorDefense,
      perimeterDefense,
      steal,
      block,
      pUDAPlayerUserId.value,
      pUDACreatedAt.value,
      pUDAUpdatedAt.value,
    );

    return this.#playerUserDefensiveAttributesRepository.save(playerUserDefensiveAttributes);
  }
}
