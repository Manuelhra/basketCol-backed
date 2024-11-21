import { ExcelSheetMapping } from '../../../../../../../shared/infrastructure/file-upload/excel/constants/ExcelColumnMappings';

export const SHEET_NAME = 'Registrar Equipos en Liga';

export const LEAGUE_TEAM_MAPPINGS: ExcelSheetMapping = {
  sheetName: SHEET_NAME,
  mappings: [
    { excelColumn: 'ID de Equipo', dtoProperty: 'teamId', type: 'string' },
    { excelColumn: 'ID de Liga', dtoProperty: 'leagueId', type: 'string' },
  ],
};

// TODO: // un jugador solo puede tener una estadísticas
// un equipo solo puede tener unas estadísticas
// un jugador solo puede tener los tipos de atributos
// TODO: Asegurarse de que en todos los caos de uso se use IudUniquessValidator y si se requiere que solo pueda acceder el usuario host
// TODO: Validar todos los servicios de nuevo
// TODO: Validar que en los servicios BULK no se está inyectando el UUID generator en awilix
// TODO: Crear campo de logo para equipo
