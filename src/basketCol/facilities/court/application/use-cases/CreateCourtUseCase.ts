import {
  BusinessDateService,
  Court,
  CourtCreatedAt,
  CourtEstablishmentDate,
  CourtId,
  CourtNullableReferencedFacilityId,
  CourtRegisteredById,
  CourtUpdatedAt,
  DateValueObject,
  GymValidationService,
  HostUserType,
  HostUserValidationService,
  ICourtPrimitives,
  ICourtRepository,
  IdUniquenessValidatorService,
} from '@basketcol/domain';

import { CreateCourtDTO } from '../dtos/CreateCourtDTO';
import { ICreateCourtUseCase } from './ports/ICreateCourtUseCase';
import { IUserContext } from '../../../../shared/application/context/ports/IUserContext';
import { UnauthorizedAccessError } from '../../../../shared/application/exceptions/UnauthorizedAccessError';

type Dependencies = {
  readonly idUniquenessValidatorService: IdUniquenessValidatorService;
  readonly hostUserValidationService: HostUserValidationService;
  readonly gymValidationService: GymValidationService;
  readonly businessDateService: BusinessDateService;
  readonly courtRepository: ICourtRepository;
};

export class CreateCourtUseCase implements ICreateCourtUseCase {
  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  readonly #hostUserValidationService: HostUserValidationService;

  readonly #gymValidationService: GymValidationService;

  readonly #businessDateService: BusinessDateService;

  readonly #courtRepository: ICourtRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
    this.#hostUserValidationService = dependencies.hostUserValidationService;
    this.#gymValidationService = dependencies.gymValidationService;
    this.#businessDateService = dependencies.businessDateService;
    this.#courtRepository = dependencies.courtRepository;
  }

  public static create(dependencies: Dependencies): CreateCourtUseCase {
    return new CreateCourtUseCase(dependencies);
  }

  public async execute(dto: CreateCourtDTO, userContext: IUserContext): Promise<void> {
    if (userContext.userType !== HostUserType.value) {
      throw UnauthorizedAccessError.create(userContext, HostUserType.value, 'create a court');
    }

    const {
      id,
      officialName,
      establishmentDate,
      surface,
      hoopHeight,
      location,
      mainImage,
      gallery,
      facilityId,
    } = dto;

    const courtId: CourtId = CourtId.create(id);
    const courtRegisteredById: CourtRegisteredById = CourtRegisteredById.create(userContext.userId);
    const courtEstablishmentDate: CourtEstablishmentDate = CourtEstablishmentDate.create(establishmentDate);
    const currentDate: DateValueObject = this.#businessDateService.getCurrentDate();

    await this.#idUniquenessValidatorService.ensureUniqueId<CourtId, ICourtPrimitives, Court>(courtId);
    await this.#hostUserValidationService.ensureHostUserExists(courtRegisteredById.value);
    this.#businessDateService.ensureNotGreaterThan<CourtEstablishmentDate, DateValueObject>(courtEstablishmentDate, currentDate);

    const courtCreatedAt: CourtCreatedAt = this.#businessDateService.getCurrentDate();
    const courtUpdatedAt: CourtUpdatedAt = this.#businessDateService.getCurrentDate();

    const courtNullableFacilityId: CourtNullableReferencedFacilityId = CourtNullableReferencedFacilityId.create(facilityId);

    if (courtNullableFacilityId.value !== null) {
      // TODO: Crear un servicio de dominio que valida si existe una instalación con ese ID.
      await this.#gymValidationService.ensureGymExists(courtNullableFacilityId.value);
    }

    const court: Court = Court.create(
      courtId.value,
      officialName,
      courtEstablishmentDate.value,
      surface,
      hoopHeight,
      courtRegisteredById.hostUserIdAsString,
      location,
      mainImage,
      gallery,
      courtNullableFacilityId.facilityIdAsStringOrNull,
      courtCreatedAt.value,
      courtUpdatedAt.value,
    );

    return this.#courtRepository.save(court);
  }
}
