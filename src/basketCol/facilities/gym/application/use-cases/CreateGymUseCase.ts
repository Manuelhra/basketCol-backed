import {
  BusinessDateService,
  DateValueObject,
  Gym,
  GymCreatedAt,
  GymEstablishmentDate,
  GymId,
  GymRegisteredById,
  GymUpdatedAt,
  HostUserValidationService,
  IdUniquenessValidatorService,
  IGymPrimitives,
  IGymRepository,
} from '@basketcol/domain';

import { CreateGymDTO } from '../dtos/CreateGymDTO';
import { ICreateGymUseCase } from './ports/ICreateGymUseCase';

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

  public async execute(dto: CreateGymDTO): Promise<void> {
    const {
      id,
      officialName,
      location,
      establishmentDate,
      registeredById,
      mainImage,
      gallery,
    } = dto;
    const gymId: GymId = GymId.create(id);
    const gymRegisteredById: GymRegisteredById = GymRegisteredById.create(registeredById);
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
