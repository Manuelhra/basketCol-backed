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
  IGym,
  IGymRepository,
} from '@basketcol/domain';

import { CreateGymDTO } from '../dtos/CreateGymDTO';
import { ICreateGymUseCase } from './ports/ICreateGymUseCase';

export class CreateGymUseCase implements ICreateGymUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #hostUserValidationService: HostUserValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #gymRepository: IGymRepository;

  constructor(dependencies: {
    idUniquenessValidatorService: IdUniquenessValidatorService;
    hostUserValidationService: HostUserValidationService;
    businessDateService: BusinessDateService;
    gymRepository: IGymRepository;
  }) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#hostUserValidationService = dependencies.hostUserValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#gymRepository = dependencies.gymRepository;
  }

  public async execute(dto: CreateGymDTO): Promise<void> {
    const {
      id,
      officialName,
      location,
      establishmentDate,
      registeredById,
    } = dto;
    const gymId: GymId = new GymId(id);
    const gymRegisteredById: GymRegisteredById = new GymRegisteredById(registeredById);
    const gymEstablishmentDate: GymEstablishmentDate = new GymEstablishmentDate(establishmentDate);
    const currentDate: DateValueObject = this.#businessDateService.getCurrentDate();

    await this.#idUniquenessValidatorService.ensureUniqueId<GymId, IGym, Gym>(gymId);
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
      gymCreatedAt.value,
      gymUpdatedAt.value,
    );

    return this.#gymRepository.save(gym);
  }
}
