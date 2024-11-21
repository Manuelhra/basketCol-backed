import {
  BusinessDateDomainService,
  HostUserType,
  IdUniquenessValidatorDomainService,
  IPlayerUserSkillAttributesPrimitives,
  IPlayerUserSkillAttributesRepository,
  PlayerUserSkillAttributes,
  PlayerUserValidationDomainService,
  PUSASkillAttributesCreatedAt,
  PUSASkillAttributesId,
  PUSASkillAttributesPlayerUserId,
  PUSASkillAttributesUpdatedAt,
} from '@basketcol/domain';

import { CreateSkillAttributesDTO } from '../dtos/CreateSkillAttributesDTO';
import { ICreateSkillAttributesUseCase } from './ports/ICreateSkillAttributesUseCase';
import { IUserContext } from '../../../../../../shared/application/context/ports/IUserContext';
import { UnauthorizedAccessError } from '../../../../../../shared/application/exceptions/UnauthorizedAccessError';

type Dependencies = {
  idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  playerUserValidationDomainService: PlayerUserValidationDomainService;
  businessDateDomainService: BusinessDateDomainService;
  playerUserSkillAttributesRepository: IPlayerUserSkillAttributesRepository;
};

export class CreateSkillAttributesUseCase implements ICreateSkillAttributesUseCase {
  readonly #idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;

  readonly #playerUserValidationDomainService: PlayerUserValidationDomainService;

  readonly #businessDateDomainService: BusinessDateDomainService;

  readonly #playerUserSkillAttributesRepository: IPlayerUserSkillAttributesRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorDomainService = dependencies.idUniquenessValidatorDomainService;
    this.#playerUserValidationDomainService = dependencies.playerUserValidationDomainService;
    this.#businessDateDomainService = dependencies.businessDateDomainService;
    this.#playerUserSkillAttributesRepository = dependencies.playerUserSkillAttributesRepository;
  }

  public static create(dependencies: Dependencies): CreateSkillAttributesUseCase {
    return new CreateSkillAttributesUseCase(dependencies);
  }

  public async execute(dto: CreateSkillAttributesDTO, userContext: IUserContext): Promise<void> {
    if (userContext.userType !== HostUserType.value) {
      throw UnauthorizedAccessError.create(userContext, HostUserType.value, 'create skill attributes');
    }

    const {
      id,
      passAccuracy,
      ballHandle,
      speedWithBall,
      playerUserId,
    } = dto;

    const pUSASkillAttributesId: PUSASkillAttributesId = PUSASkillAttributesId.create(id);
    const pUSASkillAttributesPlayerUserId: PUSASkillAttributesPlayerUserId = PUSASkillAttributesPlayerUserId.create(playerUserId);

    await this.#idUniquenessValidatorDomainService.ensureUniqueId<PUSASkillAttributesId, IPlayerUserSkillAttributesPrimitives, PlayerUserSkillAttributes>(pUSASkillAttributesId);
    await this.#playerUserValidationDomainService.ensurePlayerUserExists(pUSASkillAttributesPlayerUserId);

    const pUSASkillAttributesCreatedAt: PUSASkillAttributesCreatedAt = this.#businessDateDomainService.getCurrentDate();
    const pUSASkillAttributesUpdatedAt: PUSASkillAttributesUpdatedAt = this.#businessDateDomainService.getCurrentDate();

    const playerUserSkillAttributes: PlayerUserSkillAttributes = PlayerUserSkillAttributes.create(
      pUSASkillAttributesId.value,
      passAccuracy,
      ballHandle,
      speedWithBall,
      pUSASkillAttributesPlayerUserId.value,
      pUSASkillAttributesCreatedAt.value,
      pUSASkillAttributesUpdatedAt.value,
    );

    return this.#playerUserSkillAttributesRepository.save(playerUserSkillAttributes);
  }
}
