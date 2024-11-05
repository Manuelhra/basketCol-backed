import {
  IdUniquenessValidatorService,
  PlayerUserValidationService,
  BusinessDateService,
  IPlayerUserReboundingAttributesRepository,
  PlayerUserReboundingAttributes,
  PURAId,
  PURAReferencedPlayerUserId,
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
  idUniquenessValidatorService: IdUniquenessValidatorService;
  playerUserValidationService: PlayerUserValidationService;
  businessDateService: BusinessDateService;
  playerUserReboundingAttributesRepository: IPlayerUserReboundingAttributesRepository;
};

export class CreateReboundingAttributesUseCase implements ICreateReboundingAttributesUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #playerUserValidationService: PlayerUserValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #playerUserReboundingAttributesRepository: IPlayerUserReboundingAttributesRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#playerUserValidationService = dependencies.playerUserValidationService;
    this.#businessDateService = dependencies.businessDateService;
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
    const pURAReferencedPlayerUserId: PURAReferencedPlayerUserId = PURAReferencedPlayerUserId.create(playerUserId);

    await this.#idUniquenessValidatorService.ensureUniqueId<PURAId, IPlayerUserReboundingAttributesPrimitives, PlayerUserReboundingAttributes>(playerUserReboundingAttributesId);
    await this.#playerUserValidationService.ensurePlayerUserExists(pURAReferencedPlayerUserId.value);

    const pURACreatedAt: PURACreatedAt = this.#businessDateService.getCurrentDate();
    const pURAUpdatedAt: PURAUpdatedAt = this.#businessDateService.getCurrentDate();

    const playerUserReboundingAttributes: PlayerUserReboundingAttributes = PlayerUserReboundingAttributes.create(
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
