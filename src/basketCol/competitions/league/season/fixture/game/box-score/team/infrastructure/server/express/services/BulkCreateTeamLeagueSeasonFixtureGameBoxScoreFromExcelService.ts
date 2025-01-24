import XLSX, { WorkBook, WorkSheet } from 'xlsx';

import { IUuidGenerator } from '../../../../../../../../../../../shared/application/uuid/ports/IUuidGenerator';
import { ICreateTeamLeagueSeasonFixtureGameBoxScoreUseCase } from '../../../../application/use-cases/ports/ICreateTeamLeagueSeasonFixtureGameBoxScoreUseCase';
import { IUserContext } from '../../../../../../../../../../../shared/application/context/ports/IUserContext';
import { CreateTeamLeagueSeasonFixtureGameBoxScoreDTO } from '../../../../application/dtos/CreateTeamLeagueSeasonFixtureGameBoxScoreDTO';
import { LEAGUE_SEASON_FIXTURE_GAME_BOX_SCORE_TEAM_MAPPINGS } from '../../../file-upload/excel/constants/mappings';
import { ExcelToDTOMapper } from '../../../../../../../../../../../shared/infrastructure/file-upload/excel/mappers/ExcelToDTOMapper';

type Dependencies = {
  readonly createTeamLeagueSeasonFixtureGameBoxScoreUseCase: ICreateTeamLeagueSeasonFixtureGameBoxScoreUseCase;
  readonly uuidGenerator: IUuidGenerator;
};
export class BulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelService {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): BulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelService {
    return new BulkCreateTeamLeagueSeasonFixtureGameBoxScoreFromExcelService(dependencies);
  }

  public async execute(workbook: WorkBook, userContext: IUserContext): Promise<void> {
    const worksheet: WorkSheet | undefined = this.#getWorksheet(workbook);

    if (!worksheet) {
      return;
    }

    const dtos: CreateTeamLeagueSeasonFixtureGameBoxScoreDTO[] = this.#createDTOsFromWorksheet(worksheet);
    await this.#processFixtureGamesBoxScore(dtos, userContext);
  }

  #getWorksheet(workbook: WorkBook): WorkSheet | undefined {
    const { sheetName } = LEAGUE_SEASON_FIXTURE_GAME_BOX_SCORE_TEAM_MAPPINGS;
    return workbook.Sheets[sheetName];
  }

  #createDTOsFromWorksheet(worksheet: WorkSheet): CreateTeamLeagueSeasonFixtureGameBoxScoreDTO[] {
    const { mappings } = LEAGUE_SEASON_FIXTURE_GAME_BOX_SCORE_TEAM_MAPPINGS;
    const rawData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

    return rawData.map((row) => ExcelToDTOMapper.mapToDTOFromArray<CreateTeamLeagueSeasonFixtureGameBoxScoreDTO>(
      row,
      mappings,
    ));
  }

  async #processFixtureGamesBoxScore(dtos: CreateTeamLeagueSeasonFixtureGameBoxScoreDTO[], userContext: IUserContext): Promise<void> {
    const createFixturePromises = dtos.map((dto) => this.dependencies.createTeamLeagueSeasonFixtureGameBoxScoreUseCase.execute({
      ...dto,
      id: this.dependencies.uuidGenerator.generate(),
    }, userContext));
    await Promise.all(createFixturePromises);
  }
}
