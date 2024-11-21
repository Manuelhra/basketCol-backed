import XLSX, {
  WorkBook,
  WorkSheet,
} from 'xlsx';

import { ICreateLeagueSeasonFixtureUseCase } from '../../application/use-cases/ports/ICreateLeagueSeasonFixtureUseCase';
import { CreateLeagueSeasonFixtureDTO } from '../../application/dtos/CreateLeagueSeasonFixtureDTO';
import { IUserContext } from '../../../../../../shared/application/context/ports/IUserContext';
import { ExcelToDTOMapper } from '../../../../../../shared/infrastructure/file-upload/excel/mappers/ExcelToDTOMapper';
import { LEAGUE_SEASON_FIXTURE_MAPPINGS } from '../file-upload/excel/constants/mappings';
import { IUuidGenerator } from '../../../../../../shared/application/uuid/ports/IUuidGenerator';

type Dependencies = {
  readonly createLeagueSeasonFixtureUseCase: ICreateLeagueSeasonFixtureUseCase;
  readonly uuidGenerator: IUuidGenerator;
};

export class BulkCreateLeagueSeasonFixtureFromExcelService {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): BulkCreateLeagueSeasonFixtureFromExcelService {
    return new BulkCreateLeagueSeasonFixtureFromExcelService(dependencies);
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
    const createFixturePromises = dtos.map((dto) => this.dependencies.createLeagueSeasonFixtureUseCase.execute({
      ...dto,
      id: this.dependencies.uuidGenerator.generate(),
    }, userContext));
    await Promise.all(createFixturePromises);
  }
}
