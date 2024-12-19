export type ColumnMappingType = 'string' | 'number' | 'date' | 'boolean' | 'time';

export interface ColumnMapping {
  readonly excelColumn: string;
  readonly dtoProperty: string;
  readonly type: ColumnMappingType;
}

export interface ExcelSheetMapping {
  readonly sheetName: string;
  readonly mappings: ColumnMapping[];
}
