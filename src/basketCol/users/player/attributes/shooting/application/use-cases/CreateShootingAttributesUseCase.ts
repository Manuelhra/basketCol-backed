import {
  BusinessDateDomainService,
  HostUserType,
  IdUniquenessValidatorDomainService,
  IPlayerUserShootingAttributesPrimitives,
  IPlayerUserShootingAttributesRepository,
  PlayerUserShootingAttributes,
  PlayerUserValidationDomainService,
  PUShootingAttributesCreatedAt,
  PUShootingAttributesId,
  PUShootingAttributesPlayerUserId,
  PUShootingAttributesUpdatedAt,
} from '@basketcol/domain';

import { CreateShootingAttributesDTO } from '../dtos/CreateShootingAttributesDTO';
import { ICreateShootingAttributesUseCase } from './ports/ICreateShootingAttributesUseCase';
import { UnauthorizedAccessError } from '../../../../../../shared/application/exceptions/UnauthorizedAccessError';
import { IUserContext } from '../../../../../../shared/application/context/ports/IUserContext';

type Dependencies = {
  idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  playerUserValidationDomainService: PlayerUserValidationDomainService;
  businessDateDomainService: BusinessDateDomainService;
  playerUserShootingAttributesRepository: IPlayerUserShootingAttributesRepository;
};

export class CreateShootingAttributesUseCase implements ICreateShootingAttributesUseCase {
  readonly #idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;

  readonly #playerUserValidationDomainService: PlayerUserValidationDomainService;

  readonly #businessDateDomainService: BusinessDateDomainService;

  readonly #playerUserShootingAttributesRepository: IPlayerUserShootingAttributesRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorDomainService = dependencies.idUniquenessValidatorDomainService;
    this.#playerUserValidationDomainService = dependencies.playerUserValidationDomainService;
    this.#businessDateDomainService = dependencies.businessDateDomainService;
    this.#playerUserShootingAttributesRepository = dependencies.playerUserShootingAttributesRepository;
  }

  public static create(dependencies: Dependencies): CreateShootingAttributesUseCase {
    return new CreateShootingAttributesUseCase(dependencies);
  }

  public async execute(dto: CreateShootingAttributesDTO, userContext: IUserContext): Promise<void> {
    if (userContext.userType !== HostUserType.value) {
      throw UnauthorizedAccessError.create(userContext, HostUserType.value, 'create shooting attributes');
    }

    const {
      id,
      closeShot,
      midRangeShot,
      threePointShot,
      freeThrow,
      playerUserId,
    } = dto;

    const pUShootingAttributesId: PUShootingAttributesId = PUShootingAttributesId.create(id);
    const pUShootingAttributesPlayerUserId: PUShootingAttributesPlayerUserId = PUShootingAttributesPlayerUserId.create(playerUserId);

    await this.#idUniquenessValidatorDomainService.ensureUniqueId<PUShootingAttributesId, IPlayerUserShootingAttributesPrimitives, PlayerUserShootingAttributes>(pUShootingAttributesId);
    await this.#playerUserValidationDomainService.ensurePlayerUserExists(pUShootingAttributesPlayerUserId);

    const pUShootingAttributesCreatedAt: PUShootingAttributesCreatedAt = this.#businessDateDomainService.getCurrentDate();
    const pUShootingAttributesUpdatedAt: PUShootingAttributesUpdatedAt = this.#businessDateDomainService.getCurrentDate();

    const playerUserShootingAttributes: PlayerUserShootingAttributes = PlayerUserShootingAttributes.create(
      pUShootingAttributesId.value,
      closeShot,
      midRangeShot,
      threePointShot,
      freeThrow,
      pUShootingAttributesPlayerUserId.value,
      pUShootingAttributesCreatedAt.value,
      pUShootingAttributesUpdatedAt.value,
    );

    return this.#playerUserShootingAttributesRepository.save(playerUserShootingAttributes);
  }
}
