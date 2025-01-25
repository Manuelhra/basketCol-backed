import { ExcelSheetMapping } from '../../../../../../../../../../../shared/infrastructure/file-upload/excel/constants/ExcelColumnMappings';

export const SHEET_NAME = 'Estadísticas del Partido';

export const LEAGUE_SEASON_FIXTURE_GAME_BOX_SCORE_PLAYER_MAPPINGS: ExcelSheetMapping = {
  sheetName: SHEET_NAME,
  mappings: [
    { excelColumn: 'Puntos', dtoProperty: 'points', type: 'number' },
    { excelColumn: 'Rebotes Ofensivos', dtoProperty: 'offensiveRebounds', type: 'number' },
    { excelColumn: 'Rebotes Defensivos', dtoProperty: 'defensiveRebounds', type: 'number' },
    { excelColumn: 'Asistencias', dtoProperty: 'assists', type: 'number' },
    { excelColumn: 'Robos', dtoProperty: 'steals', type: 'number' },
    { excelColumn: 'Bloqueos', dtoProperty: 'blocks', type: 'number' },
    { excelColumn: 'Faltas', dtoProperty: 'fouls', type: 'number' },
    { excelColumn: 'Pérdidas', dtoProperty: 'turnovers', type: 'number' },
    { excelColumn: 'Tiros de 3 Intentados', dtoProperty: 'threePointersAttempted', type: 'number' },
    { excelColumn: 'Tiros de 3 Anotados', dtoProperty: 'threePointersMade', type: 'number' },
    { excelColumn: 'Tiros Libres Intentados', dtoProperty: 'freeThrowsAttempted', type: 'number' },
    { excelColumn: 'Tiros Libres Anotados', dtoProperty: 'freeThrowsMade', type: 'number' },
    { excelColumn: 'Tiros de Campo Intentados', dtoProperty: 'fieldGoalsAttempted', type: 'number' },
    { excelColumn: 'Tiros de Campo Anotados', dtoProperty: 'fieldGoalsMade', type: 'number' },
    { excelColumn: 'ID del Partido', dtoProperty: 'fixtureGameId', type: 'string' },
    { excelColumn: 'ID del Jugador', dtoProperty: 'playerUserId', type: 'string' },
  ],
};
