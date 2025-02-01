import XLSX, { WorkBook, WorkSheet } from 'xlsx';

import { IUserContext } from '../../../../../../../../../shared/application/context/ports/IUserContext';
import { IUuidGenerator } from '../../../../../../../../../shared/application/uuid/ports/IUuidGenerator';
import { ExcelToDTOMapper } from '../../../../../../../../../shared/infrastructure/file-upload/excel/mappers/ExcelToDTOMapper';
import { CreatePlayerUserLeagueSeasonFixtureGameBoxScoreDTO } from '../../application/dtos/CreatePlayerUserLeagueSeasonFixtureGameBoxScoreDTO';
import { ICreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase } from '../../application/use-cases/ports/ICreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase';
import { LEAGUE_SEASON_FIXTURE_GAME_BOX_SCORE_PLAYER_MAPPINGS } from '../file-upload/excel/constants/mappings';

type Dependencies = {
  readonly createPlayerUserLeagueSeasonFixtureGameBoxScoreUseCase: ICreatePlayerUserLeagueSeasonFixtureGameBoxScoreUseCase;
  readonly uuidGenerator: IUuidGenerator;
};
export class BulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelService {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): BulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelService {
    return new BulkCreatePlayerUserLeagueSeasonFixtureGameBoxScoreFromExcelService(dependencies);
  }

  public async execute(workbook: WorkBook, userContext: IUserContext): Promise<void> {
    const worksheet: WorkSheet | undefined = this.#getWorksheet(workbook);

    if (!worksheet) {
      return;
    }

    const dtos: CreatePlayerUserLeagueSeasonFixtureGameBoxScoreDTO[] = this.#createDTOsFromWorksheet(worksheet);
    await this.#processFixtureGamesBoxScore(dtos, userContext);
  }

  #getWorksheet(workbook: WorkBook): WorkSheet | undefined {
    const { sheetName } = LEAGUE_SEASON_FIXTURE_GAME_BOX_SCORE_PLAYER_MAPPINGS;
    return workbook.Sheets[sheetName];
  }

  #createDTOsFromWorksheet(worksheet: WorkSheet): CreatePlayerUserLeagueSeasonFixtureGameBoxScoreDTO[] {
    const { mappings } = LEAGUE_SEASON_FIXTURE_GAME_BOX_SCORE_PLAYER_MAPPINGS;
    const rawData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

    return rawData.map((row) => ExcelToDTOMapper.mapToDTOFromArray<CreatePlayerUserLeagueSeasonFixtureGameBoxScoreDTO>(
      row,
      mappings,
    ));
  }

  async #processFixtureGamesBoxScore(dtos: CreatePlayerUserLeagueSeasonFixtureGameBoxScoreDTO[], userContext: IUserContext): Promise<void> {
    const createFixturePromises = dtos.map((dto) => this.dependencies.createPlayerUserLeagueSeasonFixtureGameBoxScoreUseCase.execute({
      ...dto,
      id: this.dependencies.uuidGenerator.generate(),
    }, userContext));
    await Promise.all(createFixturePromises);
  }
}
