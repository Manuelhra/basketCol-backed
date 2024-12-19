import { ExcelSheetMapping } from '../../../../../../../../../shared/infrastructure/file-upload/excel/constants/ExcelColumnMappings';

export const SHEET_NAME = 'Partidos';

export const LEAGUE_SEASON_FIXTURE_GAME_MAPPINGS: ExcelSheetMapping = {
  sheetName: SHEET_NAME,
  mappings: [
    { excelColumn: 'Hora de Juego', dtoProperty: 'startTime', type: 'time' },
    { excelColumn: 'ID del Equipo Local', dtoProperty: 'homeTeamId', type: 'string' },
    { excelColumn: 'ID del Equipo Visitante', dtoProperty: 'awayTeamId', type: 'string' },
    { excelColumn: 'Tipo de Partido', dtoProperty: 'gameType', type: 'string' },
    { excelColumn: 'Duración del Partido', dtoProperty: 'gameDuration', type: 'number' },
    { excelColumn: 'ID del Árbitro Principal', dtoProperty: 'headRefereeId', type: 'string' },
    { excelColumn: 'ID del Árbitro Asistente', dtoProperty: 'assistantRefereeId', type: 'string' },
    { excelColumn: 'ID de la Cancha', dtoProperty: 'courtId', type: 'string' },
    { excelColumn: 'ID del Fixture', dtoProperty: 'fixtureId', type: 'string' },
  ],
};
