import {
  BusinessDateService,
  DateValueObject,
  Gym,
  GymCreatedAt,
  GymEstablishmentDate,
  GymId,
  GymRegisteredById,
  GymUpdatedAt,
  HostUserType,
  HostUserValidationService,
  IdUniquenessValidatorService,
  IGymPrimitives,
  IGymRepository,
} from '@basketcol/domain';

import { CreateGymDTO } from '../dtos/CreateGymDTO';
import { ICreateGymUseCase } from './ports/ICreateGymUseCase';
import { IUserContext } from '../../../../shared/application/context/ports/IUserContext';
import { UnauthorizedAccessError } from '../../../../shared/application/exceptions/UnauthorizedAccessError';

type Dependencies = {
  idUniquenessValidatorService: IdUniquenessValidatorService;
  hostUserValidationService: HostUserValidationService;
  businessDateService: BusinessDateService;
  gymRepository: IGymRepository;
};

export class CreateGymUseCase implements ICreateGymUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #hostUserValidationService: HostUserValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #gymRepository: IGymRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#hostUserValidationService = dependencies.hostUserValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#gymRepository = dependencies.gymRepository;
  }

  public static create(dependencies: Dependencies): CreateGymUseCase {
    return new CreateGymUseCase(dependencies);
  }

  public async execute(dto: CreateGymDTO, userContext: IUserContext): Promise<void> {
    if (userContext.userType !== HostUserType.value) {
      throw UnauthorizedAccessError.create(userContext, HostUserType.value, 'create a court');
    }

    const {
      id,
      officialName,
      location,
      establishmentDate,
      mainImage,
      gallery,
    } = dto;

    const gymId: GymId = GymId.create(id);
    const gymRegisteredById: GymRegisteredById = GymRegisteredById.create(userContext.userId);
    const gymEstablishmentDate: GymEstablishmentDate = GymEstablishmentDate.create(establishmentDate);
    const currentDate: DateValueObject = this.#businessDateService.getCurrentDate();

    await this.#idUniquenessValidatorService.ensureUniqueId<GymId, IGymPrimitives, Gym>(gymId);
    await this.#hostUserValidationService.ensureHostUserExists(gymRegisteredById.value);
    this.#businessDateService.ensureNotGreaterThan<GymEstablishmentDate, DateValueObject>(gymEstablishmentDate, currentDate);

    const gymCreatedAt: GymCreatedAt = this.#businessDateService.getCurrentDate();
    const gymUpdatedAt: GymUpdatedAt = this.#businessDateService.getCurrentDate();

    const gym: Gym = Gym.create(
      gymId.value,
      officialName,
      location,
      gymEstablishmentDate.value,
      gymRegisteredById.hostUserIdAsString,
      mainImage,
      gallery,
      gymCreatedAt.value,
      gymUpdatedAt.value,
    );

    return this.#gymRepository.save(gym);
  }
}
