import XLSX, {
  WorkBook,
  WorkSheet,
} from 'xlsx';

import { ICreateLeagueSeasonFixtureUseCase } from '../../application/use-cases/ports/ICreateLeagueSeasonFixtureUseCase';
import { LEAGUE_SEASON_FIXTURE_MAPPINGS } from '../excel/constants/mappings';
import { CreateLeagueSeasonFixtureDTO } from '../../application/dtos/CreateLeagueSeasonFixtureDTO';
import { ExcelToDTOMapper } from '../../../../../../shared/infrastructure/excel/mappers/ExcelToDTOMapper';
import { IUserContext } from '../../../../../../shared/application/context/ports/IUserContext';

type Dependencies = {
  readonly createLeagueSeasonFixtureUseCase: ICreateLeagueSeasonFixtureUseCase;
};

export class BulkCreateLeagueSeasonFixtureService {
  readonly #createLeagueSeasonFixtureUseCase: ICreateLeagueSeasonFixtureUseCase;

  private constructor(dependencies: Dependencies) {
    this.#createLeagueSeasonFixtureUseCase = dependencies.createLeagueSeasonFixtureUseCase;
  }

  public static create(dependencies: Dependencies): BulkCreateLeagueSeasonFixtureService {
    return new BulkCreateLeagueSeasonFixtureService(dependencies);
  }

  public async execute(workbook: WorkBook, userContext: IUserContext): Promise<void> {
    const worksheet: WorkSheet | undefined = this.#getWorksheet(workbook);

    if (!worksheet) {
      return;
    }

    const dtos: CreateLeagueSeasonFixtureDTO[] = this.#createDTOsFromWorksheet(worksheet);
    await this.#processFixtures(dtos, userContext);
  }

  #getWorksheet(workbook: WorkBook): WorkSheet | undefined {
    const { sheetName } = LEAGUE_SEASON_FIXTURE_MAPPINGS;
    return workbook.Sheets[sheetName];
  }

  #createDTOsFromWorksheet(worksheet: WorkSheet): CreateLeagueSeasonFixtureDTO[] {
    const { mappings } = LEAGUE_SEASON_FIXTURE_MAPPINGS;
    const rawData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

    return rawData.map((row) => ExcelToDTOMapper.mapToDTOFromArray<CreateLeagueSeasonFixtureDTO>(
      row,
      mappings,
    ));
  }

  async #processFixtures(dtos: CreateLeagueSeasonFixtureDTO[], userContext: IUserContext): Promise<void> {
    const createFixturePromises = dtos.map((dto) => this.#createLeagueSeasonFixtureUseCase.execute(dto, userContext));

    await Promise.all(createFixturePromises);
  }
}
