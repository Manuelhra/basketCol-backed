import {
  BusinessDateService,
  DateValueObject,
  IdUniquenessValidatorService,
  ILeague,
  ILeagueRepository,
  League,
  LeagueCreatedAt,
  LeagueEstablishmentDate,
  LeagueFounderUserValidationService,
  LeagueId,
  LeagueName,
  LeagueUpdatedAt,
  LeagueValidationNameService,
  LReferencedLeagueFounderUserId,
} from '@basketcol/domain';

import { CreateLeagueDTO } from '../dtos/CreateLeagueDTO';
import { ICreateLeagueUseCase } from './ports/ICreateLeagueUseCase';

export class CreateLeagueUseCase implements ICreateLeagueUseCase {
  readonly #businessDateService: BusinessDateService;

  readonly #leagueValidationNameService: LeagueValidationNameService;

  readonly #leagueRepository: ILeagueRepository;

  readonly #leagueFounderUserValidationService: LeagueFounderUserValidationService;

  readonly #idUniquenessValidatorService: IdUniquenessValidatorService;

  constructor(dependencies: {
    BusinessDateService: BusinessDateService;
    leagueValidationNameService: LeagueValidationNameService;
    leagueRepository: ILeagueRepository;
    leagueFounderUserValidationService: LeagueFounderUserValidationService;
    idUniquenessValidatorService: IdUniquenessValidatorService;
  }) {
    this.#businessDateService = dependencies.BusinessDateService;
    this.#leagueValidationNameService = dependencies.leagueValidationNameService;
    this.#leagueRepository = dependencies.leagueRepository;
    this.#leagueFounderUserValidationService = dependencies.leagueFounderUserValidationService;
    this.#idUniquenessValidatorService = dependencies.idUniquenessValidatorService;
  }

  public async execute(dto: CreateLeagueDTO): Promise<void> {
    const {
      id,
      name,
      description,
      level,
      rules,
      location,
      establishmentDate,
      leagueFounderUserId,
    } = dto;

    const leagueId: LeagueId = new LeagueId(id);
    const leagueName: LeagueName = new LeagueName(name);
    const lReferencedLeagueFounderUserId: LReferencedLeagueFounderUserId = new LReferencedLeagueFounderUserId(leagueFounderUserId);
    const leagueEstablishmentDate: LeagueEstablishmentDate = new LeagueEstablishmentDate(establishmentDate);
    const currentDate: DateValueObject = this.#businessDateService.getCurrentDate();

    await this.#idUniquenessValidatorService.ensureUniqueId<LeagueId, ILeague, League>(leagueId);
    await this.#leagueValidationNameService.validateUniqueShortName(leagueName);
    await this.#leagueValidationNameService.validateUniqueOfficialName(leagueName);

    await this.#leagueFounderUserValidationService.ensureFounderUserExists(lReferencedLeagueFounderUserId.value);
    this.#businessDateService.ensureNotGreaterThan<LeagueEstablishmentDate, DateValueObject>(leagueEstablishmentDate, currentDate);

    const isActive: boolean = true;
    const leagueCreatedAt: LeagueCreatedAt = this.#businessDateService.getCurrentDate();
    const leagueUpdatedAt: LeagueUpdatedAt = this.#businessDateService.getCurrentDate();

    const league: League = new League(
      leagueId.value,
      name,
      description,
      rules,
      level,
      location,
      lReferencedLeagueFounderUserId.leagueFounderUserIdAsString,
      leagueEstablishmentDate.value,
      isActive,
      leagueCreatedAt.value,
      leagueUpdatedAt.value,
    );

    return this.#leagueRepository.save(league);
  }
}
