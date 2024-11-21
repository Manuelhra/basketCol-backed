export interface IExcelManager {
  readExcelFileFromBuffer(file: Buffer): Promise<any>;
  getExcelSheetNamesFromBuffer(file: Buffer): Promise<string[]>;
}
