import {
  BusinessDateDomainService,
  Court,
  CourtCreatedAt,
  CourtEstablishmentDate,
  CourtId,
  CourtFacilityId,
  CourtRegisteredById,
  CourtUpdatedAt,
  DateValueObject,
  GymValidationDomainService,
  HostUserType,
  HostUserValidationDomainService,
  ICourtPrimitives,
  ICourtRepository,
  IdUniquenessValidatorDomainService,
  GymId,
} from '@basketcol/domain';

import { CreateCourtDTO } from '../dtos/CreateCourtDTO';
import { ICreateCourtUseCase } from './ports/ICreateCourtUseCase';
import { IUserContext } from '../../../../shared/application/context/ports/IUserContext';
import { UnauthorizedAccessError } from '../../../../shared/application/exceptions/UnauthorizedAccessError';

type Dependencies = {
  readonly idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;
  readonly hostUserValidationDomainService: HostUserValidationDomainService;
  readonly gymValidationDomainService: GymValidationDomainService;
  readonly businessDateDomainService: BusinessDateDomainService;
  readonly courtRepository: ICourtRepository;
};

export class CreateCourtUseCase implements ICreateCourtUseCase {
  readonly #idUniquenessValidatorDomainService: IdUniquenessValidatorDomainService;

  readonly #hostUserValidationDomainService: HostUserValidationDomainService;

  readonly #gymValidationDomainService: GymValidationDomainService;

  readonly #businessDateDomainService: BusinessDateDomainService;

  readonly #courtRepository: ICourtRepository;

  private constructor(dependencies: Dependencies) {
    this.#idUniquenessValidatorDomainService = dependencies.idUniquenessValidatorDomainService;
    this.#hostUserValidationDomainService = dependencies.hostUserValidationDomainService;
    this.#gymValidationDomainService = dependencies.gymValidationDomainService;
    this.#businessDateDomainService = dependencies.businessDateDomainService;
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
    const currentDate: DateValueObject = this.#businessDateDomainService.getCurrentDate();

    await this.#idUniquenessValidatorDomainService.ensureUniqueId<CourtId, ICourtPrimitives, Court>(courtId);
    await this.#hostUserValidationDomainService.ensureHostUserExists(courtRegisteredById);
    this.#businessDateDomainService.ensureNotGreaterThan<CourtEstablishmentDate, DateValueObject>(courtEstablishmentDate, currentDate);

    const courtCreatedAt: CourtCreatedAt = this.#businessDateDomainService.getCurrentDate();
    const courtUpdatedAt: CourtUpdatedAt = this.#businessDateDomainService.getCurrentDate();

    const courtNullableFacilityId: CourtFacilityId = CourtFacilityId.create(facilityId);

    if (courtNullableFacilityId.value !== null) {
      // TODO: Crear un servicio de dominio que valida si existe una instalación con ese ID.
      await this.#gymValidationDomainService.ensureGymExists(GymId.create(courtNullableFacilityId.value));
    }

    const court: Court = Court.create(
      courtId.value,
      officialName,
      courtEstablishmentDate.value,
      surface,
      hoopHeight,
      courtRegisteredById.value,
      location,
      mainImage,
      gallery,
      courtNullableFacilityId.value,
      courtCreatedAt.value,
      courtUpdatedAt.value,
    );

    return this.#courtRepository.save(court);
  }
}
