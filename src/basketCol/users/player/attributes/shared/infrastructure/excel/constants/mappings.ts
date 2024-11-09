import { ExcelSheetMapping } from '../../../../../../../shared/infrastructure/excel/constants/ExcelColumnMappings';

export const SHEET_NAMES = {
  DEFENSIVE: 'Defensivos',
  FINISHING: 'Finalización',
  PHYSICAL: 'Físicos',
  SKILL: 'Habilidad',
  REBOUNDING: 'Rebote',
  SHOOTING: 'Tiro',
} as const;

export const DEFENSIVE_ATTRIBUTE_MAPPINGS: ExcelSheetMapping = {
  sheetName: SHEET_NAMES.DEFENSIVE,
  mappings: [
    { excelColumn: 'ID del Atributo', dtoProperty: 'id', type: 'string' },
    { excelColumn: 'ID del Jugador', dtoProperty: 'playerUserId', type: 'string' },
    { excelColumn: 'Defensa Interior', dtoProperty: 'interiorDefense', type: 'number' },
    { excelColumn: 'Defensa de Perímetro', dtoProperty: 'perimeterDefense', type: 'number' },
    { excelColumn: 'Robo', dtoProperty: 'steal', type: 'number' },
    { excelColumn: 'Tapón', dtoProperty: 'block', type: 'number' },
  ],
};

export const FINISHING_ATTRIBUTE_MAPPINGS: ExcelSheetMapping = {
  sheetName: SHEET_NAMES.FINISHING,
  mappings: [
    { excelColumn: 'ID del Atributo', dtoProperty: 'id', type: 'string' },
    { excelColumn: 'ID del Jugador', dtoProperty: 'playerUserId', type: 'string' },
    { excelColumn: 'Bandeja en Movimiento', dtoProperty: 'drivingLayup', type: 'number' },
    { excelColumn: 'Mate en Movimiento', dtoProperty: 'drivingDunk', type: 'number' },
    { excelColumn: 'Mate en Estático', dtoProperty: 'standingDunk', type: 'number' },
    { excelColumn: 'Control en el Poste', dtoProperty: 'postControl', type: 'number' },
  ],
};

export const PHYSICAL_ATTRIBUTE_MAPPINGS: ExcelSheetMapping = {
  sheetName: SHEET_NAMES.PHYSICAL,
  mappings: [
    { excelColumn: 'ID del Atributo', dtoProperty: 'id', type: 'string' },
    { excelColumn: 'ID del Jugador', dtoProperty: 'playerUserId', type: 'string' },
    { excelColumn: 'Velocidad', dtoProperty: 'speed', type: 'number' },
    { excelColumn: 'Aceleración', dtoProperty: 'acceleration', type: 'number' },
    { excelColumn: 'Fuerza', dtoProperty: 'strength', type: 'number' },
    { excelColumn: 'Salto Vertical', dtoProperty: 'vertical', type: 'number' },
    { excelColumn: 'Resistencia', dtoProperty: 'stamina', type: 'number' },
  ],
};

export const SKILL_ATTRIBUTE_MAPPINGS: ExcelSheetMapping = {
  sheetName: SHEET_NAMES.SKILL,
  mappings: [
    { excelColumn: 'ID del Atributo', dtoProperty: 'id', type: 'string' },
    { excelColumn: 'ID del Jugador', dtoProperty: 'playerUserId', type: 'string' },
    { excelColumn: 'Manejo de Balón', dtoProperty: 'ballHandle', type: 'number' },
    { excelColumn: 'Precisión en el Pase', dtoProperty: 'passAccuracy', type: 'number' },
    { excelColumn: 'Velocidad con el Balón', dtoProperty: 'speedWithBall', type: 'number' },
  ],
};

export const REBOUNDING_ATTRIBUTE_MAPPINGS: ExcelSheetMapping = {
  sheetName: SHEET_NAMES.REBOUNDING,
  mappings: [
    { excelColumn: 'ID del Atributo', dtoProperty: 'id', type: 'string' },
    { excelColumn: 'ID del Jugador', dtoProperty: 'playerUserId', type: 'string' },
    { excelColumn: 'Rebote Ofensivo', dtoProperty: 'offensiveRebound', type: 'number' },
    { excelColumn: 'Rebote Defensivo', dtoProperty: 'defensiveRebound', type: 'number' },
  ],
};

export const SHOOTING_ATTRIBUTE_MAPPINGS: ExcelSheetMapping = {
  sheetName: SHEET_NAMES.SHOOTING,
  mappings: [
    { excelColumn: 'ID del Atributo', dtoProperty: 'id', type: 'string' },
    { excelColumn: 'ID del Jugador', dtoProperty: 'playerUserId', type: 'string' },
    { excelColumn: 'Tiro Cercano', dtoProperty: 'closeShot', type: 'number' },
    { excelColumn: 'Tiro de Media Distancia', dtoProperty: 'midRangeShot', type: 'number' },
    { excelColumn: 'Tiro de Tres Puntos', dtoProperty: 'threePointShot', type: 'number' },
    { excelColumn: 'Tiro Libre', dtoProperty: 'freeThrow', type: 'number' },
  ],
};

export const ALL_ATTRIBUTES_MAPPINGS = [
  DEFENSIVE_ATTRIBUTE_MAPPINGS,
  FINISHING_ATTRIBUTE_MAPPINGS,
  PHYSICAL_ATTRIBUTE_MAPPINGS,
  SKILL_ATTRIBUTE_MAPPINGS,
  REBOUNDING_ATTRIBUTE_MAPPINGS,
  SHOOTING_ATTRIBUTE_MAPPINGS,
];
