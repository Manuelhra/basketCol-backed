export interface ColumnMapping {
  readonly excelColumn: string;
  readonly dtoProperty: string;
}

export interface ExcelSheetMapping {
  readonly sheetName: string;
  readonly mappings: ColumnMapping[];
}

export const SHEET_NAMES = {
  DEFENSIVE: 'defensivos',
  FINISHING: 'finalización',
  PHYSICAL: 'físicos',
  SKILL: 'habilidad',
  REBOUNDING: 'rebote',
  SHOOTING: 'tiro',
} as const;

export const DEFENSIVE_MAPPINGS: ExcelSheetMapping = {
  sheetName: SHEET_NAMES.DEFENSIVE,
  mappings: [
    { excelColumn: 'id del atributo', dtoProperty: 'id' },
    { excelColumn: 'id del jugador', dtoProperty: 'playerUserId' },
    { excelColumn: 'defensa interior', dtoProperty: 'interiorDefense' },
    { excelColumn: 'defensa de perímetro', dtoProperty: 'perimeterDefense' },
    { excelColumn: 'robo', dtoProperty: 'steal' },
    { excelColumn: 'tapón', dtoProperty: 'block' },
  ],
};

export const FINISHING_MAPPINGS: ExcelSheetMapping = {
  sheetName: SHEET_NAMES.FINISHING,
  mappings: [
    { excelColumn: 'id del atributo', dtoProperty: 'id' },
    { excelColumn: 'id del jugador', dtoProperty: 'playerUserId' },
    { excelColumn: 'bandeja en movimiento', dtoProperty: 'drivingLayup' },
    { excelColumn: 'mate en movimiento', dtoProperty: 'drivingDunk' },
    { excelColumn: 'mate en estático', dtoProperty: 'standingDunk' },
    { excelColumn: 'control en el poste', dtoProperty: 'postControl' },
  ],
};

export const PHYSICAL_MAPPINGS: ExcelSheetMapping = {
  sheetName: SHEET_NAMES.PHYSICAL,
  mappings: [
    { excelColumn: 'id del atributo', dtoProperty: 'id' },
    { excelColumn: 'id del jugador', dtoProperty: 'playerUserId' },
    { excelColumn: 'velocidad', dtoProperty: 'speed' },
    { excelColumn: 'aceleración', dtoProperty: 'acceleration' },
    { excelColumn: 'fuerza', dtoProperty: 'strength' },
    { excelColumn: 'salto vertical', dtoProperty: 'vertical' },
    { excelColumn: 'resistencia', dtoProperty: 'stamina' },
  ],
};

export const SKILL_MAPPINGS: ExcelSheetMapping = {
  sheetName: SHEET_NAMES.SKILL,
  mappings: [
    { excelColumn: 'id del atributo', dtoProperty: 'id' },
    { excelColumn: 'id del jugador', dtoProperty: 'playerUserId' },
    { excelColumn: 'manejo de balón', dtoProperty: 'ballHandle' },
    { excelColumn: 'precisión en el pase', dtoProperty: 'passAccuracy' },
    { excelColumn: 'velocidad con el balón', dtoProperty: 'speedWithBall' },
  ],
};

export const REBOUNDING_MAPPINGS: ExcelSheetMapping = {
  sheetName: SHEET_NAMES.REBOUNDING,
  mappings: [
    { excelColumn: 'id del atributo', dtoProperty: 'id' },
    { excelColumn: 'id del jugador', dtoProperty: 'playerUserId' },
    { excelColumn: 'rebote ofensivo', dtoProperty: 'offensiveRebound' },
    { excelColumn: 'rebote defensivo', dtoProperty: 'defensiveRebound' },
  ],
};

export const SHOOTING_MAPPINGS: ExcelSheetMapping = {
  sheetName: SHEET_NAMES.SHOOTING,
  mappings: [
    { excelColumn: 'id del atributo', dtoProperty: 'id' },
    { excelColumn: 'id del jugador', dtoProperty: 'playerUserId' },
    { excelColumn: 'tiro cercano', dtoProperty: 'closeShot' },
    { excelColumn: 'tiro de media distancia', dtoProperty: 'midRangeShot' },
    { excelColumn: 'tiro de tres puntos', dtoProperty: 'threePointShot' },
    { excelColumn: 'tiro libre', dtoProperty: 'freeThrow' },
  ],
};

export const ALL_MAPPINGS = [
  DEFENSIVE_MAPPINGS,
  FINISHING_MAPPINGS,
  PHYSICAL_MAPPINGS,
  SKILL_MAPPINGS,
  REBOUNDING_MAPPINGS,
  SHOOTING_MAPPINGS,
];
