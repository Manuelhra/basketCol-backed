import XLSX, {
  WorkBook,
  WorkSheet,
} from 'xlsx';

import { IUserContext } from '../../../../../../../shared/application/context/ports/IUserContext';
import { ICreateLeagueSeasonFixtureGameUseCase } from '../../application/use-cases/ports/ICreateLeagueSeasonFixtureGameUseCase';
import { CreateLeagueSeasonFixtureGameDTO } from '../../application/dtos/CreateLeagueSeasonFixtureGameDTO';
import { ExcelToDTOMapper } from '../../../../../../../shared/infrastructure/file-upload/excel/mappers/ExcelToDTOMapper';
import { LEAGUE_SEASON_FIXTURE_GAME_MAPPINGS } from '../file-upload/excel/constants/mappings';
import { IUuidGenerator } from '../../../../../../../shared/application/uuid/ports/IUuidGenerator';

type Dependencies = {
  readonly createLeagueSeasonFixtureGameUseCase: ICreateLeagueSeasonFixtureGameUseCase;
  readonly uuidGenerator: IUuidGenerator;
};

export class BulkCreateLeagueSeasonFixtureGameFromExcelService {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): BulkCreateLeagueSeasonFixtureGameFromExcelService {
    return new BulkCreateLeagueSeasonFixtureGameFromExcelService(dependencies);
  }

  public async execute(workbook: WorkBook, userContext: IUserContext): Promise<void> {
    const worksheet: WorkSheet | undefined = this.#getWorksheet(workbook);

    if (!worksheet) {
      return;
    }

    const dtos: CreateLeagueSeasonFixtureGameDTO[] = this.#createDTOsFromWorksheet(worksheet);
    await this.#processFixtureGames(dtos, userContext);
  }

  #getWorksheet(workbook: WorkBook): WorkSheet | undefined {
    const { sheetName } = LEAGUE_SEASON_FIXTURE_GAME_MAPPINGS;
    return workbook.Sheets[sheetName];
  }

  #createDTOsFromWorksheet(worksheet: WorkSheet): CreateLeagueSeasonFixtureGameDTO[] {
    const { mappings } = LEAGUE_SEASON_FIXTURE_GAME_MAPPINGS;
    const rawData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

    return rawData.map((row) => ExcelToDTOMapper.mapToDTOFromArray<CreateLeagueSeasonFixtureGameDTO>(
      row,
      mappings,
    ));
  }

  async #processFixtureGames(dtos: CreateLeagueSeasonFixtureGameDTO[], userContext: IUserContext): Promise<void> {
    const createFixturePromises = dtos.map((dto) => this.dependencies.createLeagueSeasonFixtureGameUseCase.execute({
      ...dto,
      id: this.dependencies.uuidGenerator.generate(),
    }, userContext));
    await Promise.all(createFixturePromises);
  }
}
