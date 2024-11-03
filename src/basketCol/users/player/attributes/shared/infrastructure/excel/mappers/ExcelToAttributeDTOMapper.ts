import { ColumnMapping } from '../constants/ExcelColumnMappings';

export class ExcelToAttributeDTOMapper {
  public static mapToDTOFromArray<T>(row: Record<string, any>, mappings: ColumnMapping[]): T {
    const dto: Record<string, any> = {};

    mappings.forEach((mapping) => {
      const { excelColumn, dtoProperty } = mapping;
      if (row[excelColumn] !== undefined) {
        dto[dtoProperty] = this.#parseValue(row[excelColumn]);
      }
    });

    return dto as T;
  }

  static #parseValue(value: any): number | string {
    const numValue = Number(value);
    return Number.isNaN(numValue) ? value : numValue;
  }
}
