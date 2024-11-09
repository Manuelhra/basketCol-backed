import { ExcelSheetMapping } from '../../../../../../../shared/infrastructure/excel/constants/ExcelColumnMappings';

export const SHEET_NAME = 'Calendario de Partidos';

export const LEAGUE_SEASON_FIXTURE_MAPPINGS: ExcelSheetMapping = {
  sheetName: SHEET_NAME,
  mappings: [
    { excelColumn: 'ID de la Jornada/Fecha', dtoProperty: 'id', type: 'string' },
    { excelColumn: 'Fecha del Partido', dtoProperty: 'date', type: 'date' },
    { excelColumn: 'Nombre de la Jornada', dtoProperty: 'name', type: 'string' },
    { excelColumn: 'ID de la Temporada de Liga', dtoProperty: 'leagueSeasonId', type: 'string' },
  ],
};
