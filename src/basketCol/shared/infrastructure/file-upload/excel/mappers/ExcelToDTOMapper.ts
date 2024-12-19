import { DateValueObject } from '@basketcol/domain';

import XLSX from 'xlsx';
import { ColumnMapping, ColumnMappingType } from '../constants/ExcelColumnMappings';

export class ExcelToDTOMapper {
  public static mapToDTOFromArray<T>(
    row: Record<string, any>,
    mappings: ColumnMapping[],
  ): T {
    const dto: Record<string, any> = {};

    mappings.forEach((mapping) => {
      const { excelColumn, dtoProperty, type = 'string' } = mapping;

      if (row[excelColumn] !== undefined) {
        dto[dtoProperty] = this.#parseValue(row[excelColumn], type);
      }
    });

    return dto as T;
  }

  static #parseValue(
    value: any,
    type: ColumnMappingType,
  ): number | string | boolean {
    switch (type) {
      case 'date':
        return this.#parseDateValue(value);
      case 'number':
        return this.#parseNumberValue(value);
      case 'boolean':
        return this.#parseBooleanValue(value);
      case 'time':
        return this.#parseTimeValue(value);
      case 'string':
      default:
        return this.#parseStringValue(value);
    }
  }

  static #parseDateValue(value: any): string {
    if (typeof value === 'number') {
      // Convertir el número serial de Excel a fecha
      const date = XLSX.SSF.parse_date_code(value);
      // Aseguramos que el año tenga 4 dígitos
      const year = date.y < 100 ? 2000 + date.y : date.y;

      // Formateamos la fecha en el formato requerido DD/MM/YYYY
      const formattedDate = `${String(date.d).padStart(2, '0')}/${String(date.m).padStart(2, '0')}/${year}`;
      return formattedDate;
    }

    // Si ya es una cadena, aseguramos que tenga el formato correcto
    const stringValue = String(value);

    try {
      // Intentamos validar el formato usando DateValueObject
      DateValueObject.ensureIsValidDate(stringValue);
      return stringValue;
    } catch {
      // Si el formato no es válido, convertimos a Date y luego al formato correcto
      const date = new Date(stringValue);
      if (Number.isNaN(date.getTime())) {
        // Si no se puede convertir a fecha, usamos la fecha actual
        return DateValueObject.getCurrentDate().dateAsString;
      }
      return DateValueObject.fromDate(date).dateAsString;
    }
  }

  static #parseNumberValue(value: any): number {
    const numValue = Number(value);
    return Number.isNaN(numValue) ? 0 : numValue;
  }

  static #parseBooleanValue(value: any): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true' || value === '1';
    }
    return Boolean(value);
  }

  static #parseStringValue(value: any): string {
    if (value === null || value === undefined) return '';
    return String(value);
  }

  static #parseTimeValue(value: any): string {
    // Si el valor ya es una cadena con formato de hora
    if (typeof value === 'string' && /^\d{2}:\d{2}$/.test(value)) {
      return value;
    }

    // Si es un número decimal (representación de Excel)
    if (typeof value === 'number') {
      // Convertir el valor decimal a hora
      const hours = Math.floor(value * 24);
      const minutes = Math.round((value * 24 - hours) * 60);

      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    // Para otros casos, devolver una hora por defecto
    return '00:00';
  }
}
