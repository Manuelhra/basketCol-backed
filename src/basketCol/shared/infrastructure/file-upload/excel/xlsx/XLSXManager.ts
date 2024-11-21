import XLSX, { WorkBook } from 'xlsx';

import { IExcelManager } from '../ports/IExcelManager';

export class XLSXManager implements IExcelManager {
  public static create(): XLSXManager {
    return new XLSXManager();
  }

  public async readExcelFileFromBuffer(file: Buffer): Promise<WorkBook> {
    return new Promise((resolve, reject) => {
      try {
        const workbook = XLSX.read(file, { type: 'buffer' });
        resolve(workbook);
      } catch (error) {
        reject(error);
      }
    });
  }

  public async getExcelSheetNamesFromBuffer(file: Buffer): Promise<string[]> {
    return new Promise((resolve, reject) => {
      try {
        const workbook = XLSX.read(file, { type: 'buffer' });
        const sheetNames = workbook.SheetNames;
        resolve(sheetNames);
      } catch (error) {
        reject(error);
      }
    });
  }
}
