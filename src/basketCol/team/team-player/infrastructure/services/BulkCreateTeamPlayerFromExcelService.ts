import XLSX, {
  WorkBook,
  WorkSheet,
} from 'xlsx';

import { ICreateTeamPlayerUseCase } from '../../application/use-cases/ports/ICreateTeamPlayerUseCase';
import { IUserContext } from '../../../../shared/application/context/ports/IUserContext';
import { TEAM_PLAYER_MAPPINGS } from '../file-upload/excel/constants/mappings';
import { CreateTeamPlayerDTO } from '../../application/dtos/CreateTeamPlayerDTO';
import { ExcelToDTOMapper } from '../../../../shared/infrastructure/file-upload/excel/mappers/ExcelToDTOMapper';
import { IUuidGenerator } from '../../../../shared/application/uuid/ports/IUuidGenerator';

type Dependencies = {
  readonly createTeamPlayerUseCase: ICreateTeamPlayerUseCase;
  readonly uuidGenerator: IUuidGenerator;
};

export class BulkCreateTeamPlayerFromExcelService {
  private constructor(private readonly dependencies: Dependencies) {}

  public static create(dependencies: Dependencies): BulkCreateTeamPlayerFromExcelService {
    return new BulkCreateTeamPlayerFromExcelService(dependencies);
  }

  public async execute(workbook: WorkBook, userContext: IUserContext): Promise<void> {
    const worksheet: WorkSheet | undefined = this.#getWorksheet(workbook);

    if (!worksheet) {
      return;
    }

    const dtos: CreateTeamPlayerDTO[] = this.#createDTOsFromWorksheet(worksheet);
    await this.#processFixtures(dtos, userContext);
  }

  #getWorksheet(workbook: WorkBook): WorkSheet | undefined {
    const { sheetName } = TEAM_PLAYER_MAPPINGS;
    return workbook.Sheets[sheetName];
  }

  #createDTOsFromWorksheet(worksheet: WorkSheet): CreateTeamPlayerDTO[] {
    const { mappings } = TEAM_PLAYER_MAPPINGS;
    const rawData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

    return rawData.map((row) => ExcelToDTOMapper.mapToDTOFromArray<CreateTeamPlayerDTO>(
      row,
      mappings,
    ));
  }

  async #processFixtures(dtos: CreateTeamPlayerDTO[], userContext: IUserContext): Promise<void> {
    const createTeamPlayerPromises = dtos.map((dto) => this.dependencies.createTeamPlayerUseCase.execute({
      ...dto,
      id: this.dependencies.uuidGenerator.generate(),
    }, userContext));
    await Promise.all(createTeamPlayerPromises);
  }
}
