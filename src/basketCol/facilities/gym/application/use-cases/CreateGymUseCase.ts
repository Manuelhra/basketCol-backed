import {
  BusinessDateDomainService,
  DateValueObject,
  Gym,
  GymCreatedAt,
  GymEstablishmentDate,
  GymId,
  GymRegisteredById,
  GymUpdatedAt,
  HostUserType,
  HostUserValidationDomainService,
  IdUniquenessValidatorDomainService,
  IGymPrimitives,
  IGymRepository,
} from '@basketcol/domain';

import { CreateGymDTO } from '../dtos/CreateGymDTO';
import { ICreateGymUseCase } from './ports/ICreateGymUseCase';
import { IUserContext } from '../../../../shared/application/context/ports/IUserContext';
import { UnauthorizedAccessError } from '../../../../shared/application/exceptions/UnauthorizedAccessError';

type Dependencies = {
  idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  hostUserValidationDomainService: HostUserValidationDomainService;
  businessDateDomainService: BusinessDateDomainService;
  gymRepository: IGymRepository;
};

export class CreateGymUseCase implements ICreateGymUseCase {
  readonly #idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;

  readonly #hostUserValidationDomainService: HostUserValidationDomainService;

  readonly #businessDateDomainService: BusinessDateDomainService;

  readonly #gymRepository: IGymRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorDomainService = dependencies.idUniquenessValidatorDomainService;
    this.#hostUserValidationDomainService = dependencies.hostUserValidationDomainService;
    this.#businessDateDomainService = dependencies.businessDateDomainService;
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
    const currentDate: DateValueObject = this.#businessDateDomainService.getCurrentDate();

    await this.#idUniquenessValidatorDomainService.ensureUniqueId<GymId, IGymPrimitives, Gym>(gymId);
    await this.#hostUserValidationDomainService.ensureHostUserExists(gymRegisteredById);
    this.#businessDateDomainService.ensureNotGreaterThan<GymEstablishmentDate, DateValueObject>(gymEstablishmentDate, currentDate);

    const gymCreatedAt: GymCreatedAt = this.#businessDateDomainService.getCurrentDate();
    const gymUpdatedAt: GymUpdatedAt = this.#businessDateDomainService.getCurrentDate();

    const gym: Gym = Gym.create(
      gymId.value,
      officialName,
      location,
      gymEstablishmentDate.value,
      gymRegisteredById.value,
      mainImage,
      gallery,
      gymCreatedAt.value,
      gymUpdatedAt.value,
    );

    return this.#gymRepository.save(gym);
  }
}
