import {
  BusinessDateService,
  Court,
  CourtCreatedAt,
  CourtEstablishmentDate,
  CourtId,
  CourtNullableFacilityId,
  CourtRegisteredById,
  CourtUpdatedAt,
  DateValueObject,
  GymValidationService,
  HostUserValidationService,
  ICourt,
  ICourtRepository,
  IdUniquenessValidatorService,
} from '@basketcol/domain';

import { CreateCourtDTO } from '../dtos/CreateCourtDTO';

export class CreateCourtUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #hostUserValidationService: HostUserValidationService;

  readonly #gymValidationService: GymValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #courtRepository: ICourtRepository;

  constructor(dependencies: {
    idUniquenessValidatorService: IdUniquenessValidatorService;
    hostUserValidationService: HostUserValidationService;
    gymValidationService: GymValidationService;
    businessDateService: BusinessDateService;
    courtRepository: ICourtRepository;
  }) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#hostUserValidationService = dependencies.hostUserValidationService;
    this.#gymValidationService = dependencies.gymValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#courtRepository = dependencies.courtRepository;
  }

  public async run(payload: CreateCourtDTO): Promise<void> {
    const {
      id,
      officialName,
      establishmentDate,
      surface,
      hoopHeight,
      registeredById,
      location,
      gymId,
    } = payload;

    const courtId: CourtId = new CourtId(id);
    const courtRegisteredById: CourtRegisteredById = new CourtRegisteredById(registeredById);
    const courtEstablishmentDate: CourtEstablishmentDate = new CourtEstablishmentDate(establishmentDate);
    const currentDate: DateValueObject = this.#businessDateService.getCurrentDate();

    await this.#idUniquenessValidatorService.ensureUniqueId<CourtId, ICourt, Court>(courtId);
    await this.#hostUserValidationService.ensureHostUserExists(courtRegisteredById.value);
    this.#businessDateService.ensureNotGreaterThan<CourtEstablishmentDate, DateValueObject>(courtEstablishmentDate, currentDate);

    const courtCreatedAt: CourtCreatedAt = this.#businessDateService.getCurrentDate();
    const courtUpdatedAt: CourtUpdatedAt = this.#businessDateService.getCurrentDate();

    const courtNullableFacilityId: CourtNullableFacilityId = new CourtNullableFacilityId(gymId);

    if (courtNullableFacilityId.value !== null) {
      await this.#gymValidationService.ensureGymExists(courtNullableFacilityId.value);
    }

    const court: Court = new Court(
      courtId.value,
      officialName,
      courtEstablishmentDate.value,
      surface,
      hoopHeight,
      courtRegisteredById.hostUserIdAsString,
      location,
      courtNullableFacilityId.facilityIdAsStringOrNull,
      courtCreatedAt.value,
      courtUpdatedAt.value,
    );

    return this.#courtRepository.save(court);
  }
}
