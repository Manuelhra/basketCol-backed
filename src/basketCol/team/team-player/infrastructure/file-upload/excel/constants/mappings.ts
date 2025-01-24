import { ExcelSheetMapping } from '../../../../../../shared/infrastructure/file-upload/excel/constants/ExcelColumnMappings';

export const SHEET_NAME = 'Register Players in Team';

export const TEAM_PLAYER_MAPPINGS: ExcelSheetMapping = {
  sheetName: SHEET_NAME,
  mappings: [
    { excelColumn: 'ID de Equipo', dtoProperty: 'teamId', type: 'string' },
    { excelColumn: 'ID de Jugador', dtoProperty: 'playerUserId', type: 'string' },
    { excelColumn: 'Número de Camiseta', dtoProperty: 'jerseyNumber', type: 'number' },
    { excelColumn: 'Posición', dtoProperty: 'position', type: 'string' },
  ],
};
